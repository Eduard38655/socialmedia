// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();


router.get("/workspace_members", TokenVerifyAuth, async (req, res) => {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res
        .status(400)
        .json({ ok: false, message: "No user id available" });
    }

    const workspace_members_Data = await db.workspace_members.findMany({
      where: { userid: Number(userid) },
      include: {
        workspaces: true,
      },
    });

    return res.status(200).json({ ok: true, data: workspace_members_Data });
  } catch (error) {

    console.error("workspace_members error:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});



router.get("/details", async (req, res) => {
 try {
   

    const workspace_members_Data = await db.workspace_members.findMany( );

    return res.status(200).json({ ok: true, data: workspace_members_Data });
  } catch (error) {
    console.error("workspace_members error:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});



export default router;
