import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.put("/Update_Group_Messages/:messageid", TokenVerifyAuth, async (req, res) => {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
    const { messageid } = req.params;
    const { message } = req.body;

    if (!userid) {
      return res.status(400).json({ ok: false, message: "No user id available" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ ok: false, message: "Message is required" });
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
    console.error("Update group message error:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

export default router;