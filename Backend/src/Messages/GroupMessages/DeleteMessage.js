import express from "express";
import db from "../../../prisma/db.js";
import TokenVerifyAuth from "../../middleware/TokenVerify.auth.js";

const router = express.Router();

router.delete(
  "/Delete_channel_messages/:messageid",
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

      const deleteMessage = await db.messages.findUnique({
        where: {
          messageid: Number(messageid),
          userid: Number(userid),
        },
      });

      return res.status(200).json({ ok: true, data: deleteMessage });
    } catch (error) {
      console.error("Update direct message error:", error);
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error" });
    }
  },
);

export default router;
