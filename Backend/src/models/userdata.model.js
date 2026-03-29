import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();
/*
router.post("/", TokenVerifyAuth, async (req, res) => {
  try {
    const { userid } = req.cookies;

    const UserData = await db.users.findUnique({
      where: { userid: userid },
    });

    if (!UserData) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.json({ ok: true, data: UserData });
  } catch (error) {
    console.error("error" + error);
    return res
      .status(404)
      .json({ Error: "There was an error connectin to the server" });
  }
});
*/
router.get("/Global_users", TokenVerifyAuth, async (req, res) => {
  try {
    const GlobalUsers = await db.users.findMany({
      select: {
        userid: true,
        name: true,
        img: true,
        last_name: true,
      },
    });

    return res.status(200).json({ ok: true, data: GlobalUsers });
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ Error: "There was an error connectin to the server" });
  }
});

export default router;
