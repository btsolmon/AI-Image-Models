/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image)
      return NextResponse.json({ error: "Зураг олдсонгүй" }, { status: 400 });

    const model = getGeminiModel();

    // Base64 толгойг цэвэрлэх
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const mimeTypeMatch = image.match(/^data:([^;]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

    const result = await model.generateContent([
      "Please analyze this food image and list the ingredients.",
      { inlineData: { data: base64Data, mimeType } },
    ]);

    return NextResponse.json({ result: result.response.text() });
  } catch (error: any) {
    console.error("Caption API Error:", error);
    return NextResponse.json(
      {
        error: `Vision Error: ${error.message || "Зургийг шинжлэхэд алдаа гарлаа"}`,
      },
      { status: 500 },
    );
  }
}
