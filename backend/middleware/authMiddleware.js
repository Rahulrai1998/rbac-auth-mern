import jwt from "jsonwebtoken";

//AUTHORIZE THE USER VIA PROVIDED ACCESS-TOKEN
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(403).json({ message: "Invalid token" });
    req.user = user; //1.a
    next(); //passes control to next middleware/route handler. Or passes control down the line.
  });
};

//VERIFY THE ROLE OF LOGGED-IN USER
//It is a wrapper function to check/verify roles.
//uses closures to verify for different roles, by returning a middleware function.
//Note
export const verifyUserRole = (role) => {
  return function (req, res, next) {
    const userRole = req.user?.role;
    if (userRole !== role) res.status(403).json({ message: "Access denied!!" });
    next();
  };
};

/*
- Authorization: Bearer  access_token => split() => ["Bearer","access_token"]

- 403 Forbidden: App knows who you are but restricted to access certain resource due to lack of permissions
- 401 Unauthorized(requires authentication first): App doesn't know who you are because you are not logged in or have provided wrong credentials.

- if a jwt token verifies it returns the payload object of the token, otherwise it returns the error object.
- we can use the callback arguments

1
a. we attached the decrypted/decoded payload from access token to the req object so that we can use this payload across the handlers and routes.

*/

/*
Note: If I want to use some custom or other params apart from req, res, next, error in an express middleware. we should avoid using that extra param/arg directly into the middleware signature or parenthesis. It will cause mis-interpretations and can cause error.
Methods to use a custom param, i.e role.

1. Use a wrapper function which leverages closure. The wrapper function takes the custom param as its argument and will return the middleware function which process the required operations and checks.

2. Attach that custom param into the req object(Request mutating).
*/
