import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connected.connection.host}`);
  } catch (error) {
    console.log("Something went wrong: ", error);
    process.exit(1); //stops the current running process/whole app immediately
  }
};
