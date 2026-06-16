/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json(); // messages-ийг хүлээж авна

    // Сүүлийн мессежийг prompt болгох
    const lastMessage = messages[messages.length - 1].content;

    const model = getGeminiModel();
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini Route Error:", error);

    // Алдааны төрлийг тодорхойлж мэдээлэх
    let errorMessage = "Текст боловсруулахад алдаа гарлаа";

    if (error.message?.includes("API_KEY_INVALID")) {
      errorMessage =
        "API Key буруу байна. Google AI Studio-оос авсан түлхүүрээ зөв эсэхийг шалгана уу.";
    } else if (error.message?.includes("GEMINI_API_KEY not configured")) {
      errorMessage =
        ".env.local файл дотор GEMINI_API_KEY-г тохируулаагүй байна.";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
      },
      { status: 500 },
    );
  }
}
