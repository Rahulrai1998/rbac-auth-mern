import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

dotenv.config(); //loads .env values into process.env

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.json({ message: "Message received" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
