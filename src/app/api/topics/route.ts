
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnects";
import Topic from "@/models/topic"; 

export async function POST(req: NextRequest) {
  try {
    console.log("--- 🚀 Topic Save Request Start ---");
    
    
    await dbConnect();
    console.log("✅ Connected to MongoDB Atlas");

    const body = await req.json();
    const { title, userEmail, doi } = body;

    // 1. Validation Check
    if (!title || !userEmail) {
      console.log("❌ Validation Failed: Missing title or email");
      return NextResponse.json(
        { success: false, error: "Title and User Email are required." },
        { status: 400 }
      );
    }

    
    if (doi && doi !== "N/A") {
      const existing = await Topic.findOne({ userEmail, doi });
      if (existing) {
        console.log("ℹ️ Topic already exists for this user");
        return NextResponse.json(
          { success: false, error: "You have already saved this research paper." },
          { status: 400 }
        );
      }
    }

  
    console.log("📦 Attempting to save data:", body);
    const newTopic = await Topic.create(body);
    
    console.log("✨ Success! Topic & Note saved to Atlas ID:", newTopic._id);

    return NextResponse.json({ 
      success: true, 
      data: newTopic 
    });

  } catch (error: any) {
    console.error("❌ MONGODB ERROR:", error.message); 
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "An unknown database error occurred" 
      }, 
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    const topics = await Topic.find({ userEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: topics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}