import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnects"; 
import User from "@/models/user"; 

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

   
    await dbConnect();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { name: name },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully", 
      user: { 
        id: updatedUser._id,
        name: updatedUser.name, 
        email: updatedUser.email 
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Error:", error.message);
    return NextResponse.json(
      { error: "Server error: " + error.message }, 
      { status: 500 }
    );
  }
}