import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/Get_reactions", TokenVerifyAuth, async (req, res) => {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res.status(400).json({
        ok: false,
        message: "No user id available",
      });
    }

    const result = await db.reactions.findMany();


    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
});

export default router;
