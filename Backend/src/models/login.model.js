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

  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Email and password are required" });
  }

  const emailClean = email.trim();
  const passwordClean = password.trim();

  if (!emailClean || !passwordClean) {
    return res
      .status(400)
      .json({ ok: false, message: "Email and password cannot be empty" });
  }

  try {
       const dataHash = await bcrypt.hash(passwordClean, 10);
   console.log(dataHash);
    // ① Buscar solo por username — NO incluir password en el where
    const loginUser = await db.logins.findUnique({
      where: { username: emailClean },
    });

    // ② Verificar que existe antes de acceder a sus propiedades
    if (!loginUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    if (typeof loginUser.password !== "string" || !loginUser.password) {
      return res
        .status(500)
        .json({ ok: false, message: "Account error, contact support" });
    }

 
   
    // ③ Comparar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(
      passwordClean,
      loginUser.password,
    );
  
    

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }

    // ④ Generar token
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

    // ⑤ Responder sin exponer la contraseña
    const { password: _, ...userWithoutPassword } = loginUser;
    return res.status(200).json({ ok: true, user: userWithoutPassword });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
});

// ──────────────────────────────────────────
// GET /public/logout
// ──────────────────────────────────────────

router.get("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  return res.status(200).json({ ok: true, message: "Logout successful" });
});

export default router;
