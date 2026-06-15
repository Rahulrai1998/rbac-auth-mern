import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

/*
Authorization: Bearer  access_token
403 Forbidden(Unauthorized)

*/
