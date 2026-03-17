import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 10) {
      return NextResponse.json({ success: false, error: "Text is too short to summarize." }, { status: 400 });
    }

    // Limit the text length to avoid hitting the "Token Limit" on the first try
    const safeText = text.substring(0, 12000); 

    const prompt = `
      Summarize this research concisely in 3-4 bullet points.
      Focus on methodology and results.
      Content: ${safeText}
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ success: true, summary });

  } catch (error: any) {
    console.error("Gemini Error Detail:", error);

    // If Google says "Slow down", we tell the user nicely instead of crashing
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json({ 
        success: false, 
        error: "The AI is currently at its limit. Please wait 30 seconds and try again." 
      }, { status: 429 });
    }

    return NextResponse.json({ success: false, error: "AI Service Error. Please try again later." }, { status: 500 });
  }
}