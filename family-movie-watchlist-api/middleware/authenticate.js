import { verifyToken } from "../utils/jwt.js";
import { isBlacklisted } from "../utils/token-blacklist.js";

export function authenticate(req, res, next) {
  const authorisation = req.headers.authorization;
  if (!authorisation || !authorisation.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const [, token] = authorisation.split(" ");

  if (isBlacklisted(token)) {
    return res
      .status(401)
      .json({ error: "Token has been invalidated. Log in again" });
  }

  const verifiedToken = verifyToken(token);
  if (!verifiedToken) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  req.user = verifiedToken;

  next();
}
