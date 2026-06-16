/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Моделийг нэг удаа хадгалах хувьсагч
let model: any = null;

export function getGeminiModel(modelName: string = "gemini-flash-latest") {
  // Хэрэв модель аль хэдийн үүссэн бол түүнийг буцаана
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY тохируулагдаагүй байна");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: modelName });

  return model;
}
