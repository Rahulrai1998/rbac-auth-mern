import jwt from "jsonwebtoken";

//AUTHORIZE THE USER VIA PROVIDED ACCESS-TOKEN 
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(403).json({ message: "Invalid token" });
    req.user = user; //1.a 
    next(); //passes control to next middleware/route handler.
  });
};

/*
- Authorization: Bearer  access_token => split() => ["Bearer","access_token"]
- 403 Forbidden(Unauthorized)
- if a jwt token verifies it returns the payload object of the token, otherwise it returns the error object.
- we can use the callback arguments

1
a. we attached the decrypted/decoded payload from access token to the req object so that we can use this payload across the handlers and routes.

*/
