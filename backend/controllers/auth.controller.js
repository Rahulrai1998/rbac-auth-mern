import User from "../models/User.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists)
      res.status(400).json({
        message: "User already exists.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ message: "All fields are required." });
  const userExists = await User.findOne({ email });
  if (!userExists)
    res.status(400).json({
      message: "User doesn't exist.",
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  if (hashedPassword !== userExists.password)
    res.status(400).json({ message: "Wrong input." });
  res.status(200).json({ message: "Logged in successfully." });
};
