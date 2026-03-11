// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();

router.get("/Direct_Messages", TokenVerifyAuth, async (req, res) => {
  try {
    // obtiene userid desde token/sesión si lo necesitas (pero no obligatorio para devolver todos los mensajes)
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    const messages = await db.direct_messages.findMany({
      where: {
        receiver_id: userid,
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        users_direct_messages_sender_idTousers: {
          include: {
            logins: true,
          },
        } /*
        ,
        users_direct_messages_receiver_idTousers: {
          include: {
            logins: true,
          },
        }, */,
      },
    });

    const profileData = await db.users.findMany({
      where: {
        userid: userid,
      },
    });

    if (!profileData) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // 7) devolver resultado
    return res
      .status(200)
      .json({ ok: true, data: messages, profileData: profileData });
  } catch (error) {
    console.error("Direct_Messages error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: String(error),
    });
  }
});
/*
no la necesito se puede borarar
router.get("/GetMessageByID/:messageid", TokenVerifyAuth, async (req, res) => {
  try {
    const { messageid } = req.params;

    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    const message = await db.direct_messages.findUnique({
      where: {
        id: Number(messageid),
      },
      include: {
        users_direct_messages_sender_idTousers: true,
      },
    });

    if (!message) {
      return res.status(404).json({ ok: false, message: "Message not found" });
    }

    return res.json({ ok: true, data: message });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
});*/

export default router;
