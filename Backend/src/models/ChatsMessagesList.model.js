// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();

 router.get("/Direct_Messages", TokenVerifyAuth, async (req, res) => {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no autenticado",
      });
    }

    const messages = await db.direct_messages.findMany({
      where: {
        OR: [
          { sender_id: userid },
          { receiver_id: userid },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        users_direct_messages_sender_idTousers: {
          include: {
            logins: true,
          },
        },
        users_direct_messages_receiver_idTousers: {
          include: {
            logins: true,
          },
        },
      },
    });

    const profileData = await db.users.findUnique({
      where: {
        userid: userid,
      },
    });

    if (!profileData) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const uniqueUsers = [
      ...new Map(
        messages.map((msg) => {
          const otherUser =
            msg.sender_id === userid
              ? msg.users_direct_messages_receiver_idTousers
              : msg.users_direct_messages_sender_idTousers;

          return [otherUser?.userid, otherUser];
        })
      ).values(),
    ];

    return res.status(200).json({
      ok: true,
      data: uniqueUsers,
      profileData,
      messages,
    });
  } catch (error) {
    console.error("Direct_Messages error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: String(error),
    });
  }
});
router.get("/Direct_Messages/:senderid", TokenVerifyAuth, async (req, res) => {
  try {
    const { senderid } = req.params;

    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    const message_by_id = await db.direct_messages.findMany({
      where: {
        OR: [
          {
            sender_id: Number(userid),
            receiver_id: Number(senderid),
          },
          {
            sender_id: Number(senderid),
            receiver_id: Number(userid),
          },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        users_direct_messages_sender_idTousers: {
          select: {
            userid: true,
            name: true,
            img: true,
            last_name: true,
          }
          
        },
      },
    });

    console.log(message_by_id);

    return res.status(200).json({
      ok: true,
      data: message_by_id,
    });
  } catch (error) {
    console.log(error);
  }
});
export default router;
