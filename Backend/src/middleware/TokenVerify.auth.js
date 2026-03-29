// src/middleware/TokenVerify.auth.js
import jwt from "jsonwebtoken";
import prisma from "../../prisma/db.js";

export default async function authMiddleware(req, res, next) {
  try {
    // Extraer token correctamente: primero cookie.token, luego header Authorization
    const token =
      req.cookies?.token ||
      (req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null);

 
    if (!token) {
      return res.status(401).json({ ok: false, message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      console.log("JWT verify error:", err.message);
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    if (!decoded.loginid) {
      return res.status(401).json({ ok: false, message: "Token missing loginid" });
    }

    // Buscar login en DB (ajusta include según tu schema)
    const login = await prisma.logins.findUnique({
  where: { loginid: decoded.loginid },
  include: { users: true },
});

    if (!login) {
      return res.status(401).json({ ok: false, message: "Login not found" });
    }

    // Setear datos en req (consistentes para las rutas)
    req.login = { loginid: login.loginid, username: login.username, status: login.status };
    req.user = login.users ?? login.user ?? null;

    console.log("authMiddleware -> req.login:", req.login, "req.user:", req.user);

    next();
  } catch (error) {
    console.error("authMiddleware error:", error);
    return res.status(500).json({ ok: false, message: "Server error in auth" });
  }
}