// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.post("/Start_Message_ByID/:receiverid", TokenVerifyAuth, async (req, res) => {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
const { receiverid } = req.params;
console.log(receiverid,"red");

    if (!userid) {
      return res
        .status(400)
        .json({ ok: false, message: "No user id available" });
    }

    const Start_Conversation  = await db.direct_messages.create({
      data: {
        sender_id: userid,
        receiver_id:Number(receiverid),
        message:null,

      },
    });

    console.log(Start_Conversation,"Start_Conversation");
    
    return res.status(200).json({ ok: true, data: Start_Conversation });
  } catch (error) {
    console.error("workspace_members error:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

export default router;
