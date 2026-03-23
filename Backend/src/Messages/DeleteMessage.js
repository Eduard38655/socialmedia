// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.delete(
  "/Delete_Direct_Messages/:receiverid",
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

      const Delete_Start_Conversation = await db.direct_messages.deleteMany({
        where: {
          OR: [
            { sender_id: userid, receiver_id: Number(receiverid) },
            { sender_id: Number(receiverid), receiver_id: userid },
          ],
        },
      });

      console.log(Delete_Start_Conversation);

      return res.status(200).json({ ok: true, data: "Dato ha sido eliminado" });
    } catch (error) {
      console.error("workspace_members error:", error);
      res.status(500).json({ ok: false, message: "Internal server error" });
    }
  },
);

export default router;
