import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, paperData, noteContent } = await request.json();

    // Find the user and push the new note into their savedNotes array
    const updatedUser = await User.findOneAndUpdate(
      { email: email }, 
      { 
        $push: { 
          savedNotes: {
            paperId: paperData.id,
            title: paperData.title,
            noteContent: noteContent,
            dateSaved: new Date()
          } 
        } 
      },
      { new: true, upsert: true } // Creates user if they don't exist yet
    );

    return NextResponse.json({ message: "Note saved!", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}