import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";
const router = express.Router();

router.post("/", TokenVerifyAuth, async (req, res) => {
    // use the id coming from the auth token rather than trusting an arbitrary cookie
    const userid = req.user?.userid ?? req.login?.userid ?? req.cookies.userid;

    const UserData = await db.users.findUnique({
      where: { userid: Number(userid) },
    });

if(!UserData){
    return res.status(404).json({ok:false,message:"User not found"})
}
return res.json({ok:true,data:UserData})
});



export default router