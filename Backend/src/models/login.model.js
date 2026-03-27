import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import db from "../../prisma/db.js";

const router = express.Router();
// ──────────────────────────────────────────
// POST /public/login
// ──────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  /* ① Validar que lleguen como strings —
       si el cliente manda null/undefined bcrypt lanza
       "data and hash must be strings"               */
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
    /* ② Buscar usuario */
    const loginUser = await db.logins.findUnique({
      where: { username: emailClean },
    });

    if (!loginUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    /* ③ Verificar que el hash guardado sea un string válido
         (por si el registro se creó sin hashear la contraseña) */
    if (typeof loginUser.password !== "string" || !loginUser.password) {
      return res
        .status(500)
        .json({ ok: false, message: "Account error, contact support" });
    }

    /* ④ Comparar contraseña — aquí ya ambos son strings garantizados */
    const passwordMatch = await bcrypt.compare(
      passwordClean,
      loginUser.password,
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }

    /* ⑤ Generar token */
    const payload = {
      loginid: loginUser.loginid,
      username: loginUser.username,
      userid: loginUser.userid,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h", // ← sincronizado con maxAge de la cookie
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 h en ms
    });

    /* ⑥ Responder sin la contraseña */
    const { password: _, ...userWithoutPassword } = loginUser;
    return res.status(200).json({ ok: true, user: userWithoutPassword });
  } catch (error) {
    console.error("LOGIN ERROR NAME:", error.name);
    console.error("LOGIN ERROR MSG:", error.message);
    console.error("LOGIN ERROR STACK:", error.stack);
    return res.status(500).json({
      ok: false,
      message: error.message, // temporal para debug
    });
    console.error("LOGIN ERROR:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
});

// ──────────────────────────────────────────
// GET /private/me
// ──────────────────────────────────────────
/*
router.get("/me", TokenVerifyAuth, async (req, res) => {
  if (!req.user?.userid) {
    return res.status(401).json({ ok: false, message: "Not authenticated" });
  }
  return res.json({
    ok: true,
    userid: req.user.userid,
    username: req.user.username,
  });
});
*/
// ──────────────────────────────────────────
// GET /public/logout
// ──────────────────────────────────────────
router.get("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  return res.status(200).json({ ok: true, message: "Logout successful" });
});

export default router;
