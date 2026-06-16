/* eslint-disable @typescript-eslint/no-explicit-any */
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || body.prompt;

    if (!text) {
      return NextResponse.json(
        { error: "Тайлбар (text эсвэл prompt) шаардлагатай" },
        { status: 400 },
      );
    }

    const token = process.env.HUGGINGFACEHUB_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "HuggingFace API Token тохируулаагүй байна" },
        { status: 500 },
      );
    }

    const hf = new HfInference(token);

    // Зөвхөн Blob гэдгийг тодорхой болгож өгнө
    const imageBlob = (await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: text,
    })) as unknown as Blob; // <--- ЭНЭ ТӨРЛИЙГ НЭМЭЭРЭЙ

    // arrayBuffer() нь Blob-ын функц тул одоо алдаагүй ажиллах ёстой
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    return NextResponse.json({ imageUrl: base64Image });
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    return NextResponse.json(
      {
        error: `HuggingFace Error: ${error.message || "Зураг үүсгэхэд алдаа гарлаа"}`,
      },
      { status: 500 },
    );
  }
}
