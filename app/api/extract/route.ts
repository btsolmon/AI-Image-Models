/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text)
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    const model = getGeminiModel();
    const result = await model.generateContent(
      `Identify the ingredients from this food description: ${text}`,
    );

    return NextResponse.json({ result: result.response.text() });
  } catch (error: any) {
    console.error("Extract API Error:", error);
    return NextResponse.json(
      {
        error: `Gemini Error: ${error.message || "Орц тодорхойлоход алдаа гарлаа"}`,
      },
      { status: 500 },
    );
  }
}
