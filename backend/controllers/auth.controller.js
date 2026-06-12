import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) console.log(userExists);
    else console.log("No such user");

    res.json({
      username,
      email,
      password,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
