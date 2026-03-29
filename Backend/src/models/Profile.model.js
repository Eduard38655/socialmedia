import "dotenv/config";
import express from "express";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();

router.get("/profile",  TokenVerifyAuth,async (req, res) => {
  console.log(!req.user?.userid, "ddd");

  if (!req.user?.userid) {
    return res.status(401).json({ ok: false, message: "Not authenticated" });
  }

  return res.status(200).json({
    ok: true,
    user: {
      userid: req.user.userid,
      username: req.user.username,
    },
  });
});

export default router;
