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

    console.log("USER FOUND:", LoginUser);

    if (!LoginUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // comparar password correctamente
    const validPassword = await bcrypt.compare(password, LoginUser.password);

    console.log("PASSWORD VALID:", validPassword);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        message: "Invalid password",
      });
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
      secure: true, // importante en producción
      sameSite: "none", // importante para frontend en otro dominio
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = LoginUser;

    return res.status(200).json({
      ok: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("LOGIN ERROR BACKEND:", error);
    res.status(500).json({ message: error.message, ok: false });
  }
});

router.get("/me", TokenVerifyAuth, async (req, res) => {
  try {
    if (!req.user?.userid) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }

    return res.json({
      ok: true,
      userid: req.user.userid,
      username: req.user.username,
      loginid: req.user.loginid,
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logout successful", ok: true });
});

export default router;