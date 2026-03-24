// routes/messages.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.post(
  "/Start_Message_ByID/:receiverid",
  TokenVerifyAuth,
  async (req, res) => {
    try {
      const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
      const { receiverid } = req.params;

      if (!userid) {
        return res
          .status(400)
          .json({ ok: false, message: "No user id available" });
      }

      if (!receiverid) {
        return res
          .status(400)
          .json({ ok: false, message: "receiverid requerido" });
      }

      const conversation = await db.direct_messages.create({
        data: {
          sender_id: userid,
          receiver_id: Number(receiverid),
          message: "",
        },
      });

      return res.status(200).json({ ok: true, data: conversation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Internal server error" });
    }
  },
);

export default router;
