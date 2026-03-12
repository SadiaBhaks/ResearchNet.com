import mongoose from "mongoose";

// Define the shape of our connection object
interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect(): Promise<void> {
  // If we are already connected, don't open a new one
  if (connection.isConnected) {
    return;
  }

  // Ensure the environment variable exists
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in your environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    
    // 1 means connected, 2 means connecting, etc.
    connection.isConnected = db.connections[0].readyState;
    
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    // Force a fail so the API knows the DB is down
    throw new Error("Failed to connect to Database");
  }
}

export default dbConnect;