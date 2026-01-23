import { GoogleGenAI } from "@google/genai";
import { INGESTION_SYSTEM_PROMPT } from "./prompt";

import type { AiRes } from "../component/CreateContantModel";

const api_key = import.meta.env.VITE_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey: api_key });

export async function getTags(prompt: string): Promise<AiRes> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: INGESTION_SYSTEM_PROMPT,
    },
  });
  let text = response.text!.trim();
   if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }
  const parseRes = JSON.parse(text);
  console.log(text);
  return parseRes;
}

