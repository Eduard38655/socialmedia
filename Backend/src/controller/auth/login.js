import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../prisma/db.js";

export default async function login(req, res) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required",
    });
  }

  const emailClean = email.trim();
  const passwordClean = password.trim();

  if (!emailClean || !passwordClean) {
    return res.status(400).json({
      ok: false,
      message: "Email and password cannot be empty",
    });
  }

  try {
    const loginUser = await db.logins.findUnique({
      where: { username: emailClean },
    });

    if (!loginUser) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(
      passwordClean,
      loginUser.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      loginid: loginUser.loginid,
      username: loginUser.username,
      userid: loginUser.userid,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = loginUser;

    return res.status(200).json({
      ok: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}