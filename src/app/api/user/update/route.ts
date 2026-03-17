import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnects"; 
import User from "@/models/user"; 

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    // 1. Connect using your established helper
    await dbConnect();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // 2. Find and update the specific user based on their unique email
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { name: name },
      { new: true, runValidators: true } // returns the updated doc & checks schema rules
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Return success with the updated data
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