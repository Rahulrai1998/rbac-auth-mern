import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config(); //loads .env values into process.env

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(json());
app.use(cookieParser()); //1.a

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

/*
1.
a. cookieParser(): a middleware which reads, decodes and parses client sent cookies string into a readable and easily accessible JS object and attach them to req object for further usage in the backend app.


*/
