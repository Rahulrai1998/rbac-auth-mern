import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user)
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
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user)
      res.status(400).json({
        message: "User not found!.",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) res.status(400).json({ message: "Invalid Credentials." });
    const { _id, username, email: userEmail, role } = user;

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d", //browser auto-deletes this cookie after 7 days
      },
    );

    //1: we store refresh token into HttpOnly cookie which saves it from JS access in the client's browser.
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //1.c
      secure: process.env.NODE_ENV === "production", //1.c
      sameSite: "strict", //1.e
    });

    res.status(200).json({
      accessToken,
      user: {
        id: _id,
        username,
        userEmail,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/*
1.
a. cookie-parser: a 3rd party middleware used to read incoming cookies from the client.
b. res.cookie(name, value, options object): a built-in method in Express used to write outgoing cookies in the client. It simplifies setting the Set-Cookie response header by accepting the cookie name, value and an options object for security rules.
c. httpOnly: true: it prevents js to access this token/cookie via browser. It secures from XSS attacks from stealing the refresh token.
d. secure: true/false: ensures that the cookies are sent over only https instead http.
e. sameSite: "strict": ensures cookies never sent to the cross-site/different-origin requests. It prevents CSRF attacks.
*/
