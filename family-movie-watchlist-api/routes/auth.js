import express from "express";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Email and password and required");
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).send("User does not exist");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (user && !match) {
    return res
      .status(401)
      .send("Wrong credentials. Please enter correct username and password");
  }

  const token = signToken({ id: user.id, username, role: user.role });

  return res
    .status(200)
    .json({ message: "User logged in successfully", token });
});

export default router;
