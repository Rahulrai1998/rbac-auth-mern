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

    if (!isMatch) res.status(401).json({ message: "Invalid Credentials." });
    const { _id, username, email: userEmail, role } = user;

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
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
    //only refresh tokens will be attached to the client browser's cookie from server side.
    //access tokens will send to the client and client will store access token into the browser's cookie from client side.
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

//FUNCTION TO USE REFRESH TOKEN AND GENERATE NEW ACCESS TOKEN
export const getNewAccessToken = async (req, res) => {
  try {
    //GET REFRESH TOKEN FROM THE CLIENT
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      res.status(401).json({ message: "No  refresh token provided." });
    // 1.g
    const decryptedPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    //makes sure if user still exists instead getting deleted or blocked.
    const user = await User.findById(decryptedPayload.id);
    if (!user) res.status(404).json({ message: "User not found." });

    //GENERATE A FRESH ACCESS TOKEN
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const { _id, username, email, role } = user;

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: _id,
        email,
        username,
        role,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    // it will prevent the new access token to be re-generated after access token expiry.
    //user can still login to the app until the access token is expired.
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
1.
a. cookie-parser (cookiepParser()): a 3rd party middleware used to read, decode incoming cookies from the client.
b. res.cookie(name, value, options object): a built-in method in Express used to write outgoing cookies in the client. It simplifies setting the Set-Cookie response header by accepting the cookie name, value and an options object for security rules.
c. httpOnly: true: it prevents js to access this token/cookie via browser. It secures from XSS attacks from stealing the refresh token.
d. secure: true/false: ensures that the cookies are sent over only https instead http.
e. sameSite: "strict": ensures cookies never sent to the cross-site/different-origin requests. It prevents CSRF attacks.
f. 401 (Unauthorized): means the server rejected the request because it lacks valid authentication credentials due to missing, expired or incorrect API key, token or password.
g. jwt.verify(token, token-secret-key): if verifies, it returns the payload object else throws error.
*/
