import dbConnect from "@/lib/dbConnects";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    /
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
  console.error("DB ERROR:", err);
  throw err;
}
}