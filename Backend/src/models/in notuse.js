// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/Global_users", TokenVerifyAuth, async (req, res) => {
 try {
    
const GlobalUsers=await db.users.findMany({

    select:{
       
        userid:true,
     
    }
})

    return res.status(200).json({ ok: true, data: GlobalUsers });

 } catch (error) {
    
 }
   
});

export default router;
