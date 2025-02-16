import jwt from "jsonwebtoken";
import config from "config";

const auth = (req, res, next) => {
  try {
    let token;

    // This auth method handles both the requests types wherein token is passed as Bearer Token or as x-auth-token
    // in the header section.

    if (req.header("x-auth-token")) {
      token = req.header("x-auth-token");
    } else if (req.header("Authorization") || req.header("authorization")) {
      const authHeader =
        req.header("Authorization") || req.header("authorization");

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.statu(400).json("No token found, authorization failed !!");
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;

    console.log(req.user);

    next();
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export default auth;
