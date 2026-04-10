import mongoose from "mongoose";


interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect(): Promise<void> {

  if (connection.isConnected) {
    return;
  }

  
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in your environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    
   
    connection.isConnected = db.connections[0].readyState;
    
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
 
    throw new Error("Failed to connect to Database");
  }
}

export default dbConnect;