import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const LoginUser = await db.logins.findUnique({
      where: {
        username: email,
      },
    });
    console.log(LoginUser);
    if (!LoginUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    const info = await bcrypt.hash(password, 10);
    console.log(info, "detais");

    // comparar password
    const validPassword = await bcrypt.compare(password, LoginUser );

    if (!validPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid password", info, LoginUser });
    }

    const payload = {
      loginid: LoginUser.loginid,
      username: LoginUser.username,
      userid: LoginUser.userid,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = LoginUser;

    return res.status(200).json({
      ok: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, ok: false });
  }
});

router.get("/me", TokenVerifyAuth, async (req, res) => {
  console.log(req.user.userid, "duyaa");

  if (!req.user.userid || !req.user.userid) {
    return res.status(401).json({ ok: false, message: "Not authenticated" });
  }

  return res.json({
    ok: true,

    status: req.user.status,
    userid: req.user.userid,
    name: req.user.name,
    last_name: req.user.last_name,
    img: req.user.img,
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful", ok: true });
});

export default router;
