import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a research assistant. The user is searching for "${query}". 
    Provide 4 specific, narrowed-down research sub-topics or specialized academic titles.
    Return ONLY the suggestions separated by commas. No extra text or numbers.
    Example: Microplastic Toxicity, Bioaccumulation in Fish, ToMEx 2.0 Dataset, Risk Assessment Models`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const topicsArray = text
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 4);

    return NextResponse.json({ refinedTopics: topicsArray });

  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Gemini API Error Detail:", errorMessage);
    }

    
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return NextResponse.json(
        { error: "Model mapping error. Please try changing the model ID to 'gemini-pro' in your route.ts file." }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}