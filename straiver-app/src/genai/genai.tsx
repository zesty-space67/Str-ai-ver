import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBEuPVoSvf7KwC96d2pmWJmqJCPc4FGVQA"; // (Don't commit this in production!)
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (err: any) {
    console.error("Gemini API call failed:", err);
    return `(Error: ${err.message || "Unknown error"})`;
  }
}
