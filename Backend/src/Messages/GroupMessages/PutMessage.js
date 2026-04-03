import express from "express";
import db from "../../../prisma/db.js";
import TokenVerifyAuth from "../../middleware/TokenVerify.auth.js";

const router = express.Router();

router.put(
  "/Update_channel_messages/:messageid",
  TokenVerifyAuth,
  async (req, res) => {
    try {
      const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
      const { messageid } = req.params;
      const { message } = req.body;

      if (!userid) {
        return res
          .status(400)
          .json({ ok: false, message: "No user id available" });
      }

      if (!messageid) {
        return res
          .status(400)
          .json({ ok: false, message: "Message id is required" });
      }

      if (!message || !message.trim()) {
        return res
          .status(400)
          .json({ ok: false, message: "Message cannot be empty" });
      }
const existingMessage = await db.messages.findFirst({
  where: {
    messageid: Number(messageid),
    userid: Number(userid),
  },
});

if (!existingMessage) {
  return res.status(403).json({
    ok: false,
    message: "No tienes permiso para editar este mensaje",
  });
}

const updatedMessage = await db.messages.update({
  where: {
    messageid: Number(messageid),
  },
  data: {
    message: message.trim(),
  },
});

      return res.status(200).json({ ok: true, data: updatedMessage });
    } catch (error) {
      console.error("Update direct message error:", error);
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error" });
    }
  },
);

export default router;
