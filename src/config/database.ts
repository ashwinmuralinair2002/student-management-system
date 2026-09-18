import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}
