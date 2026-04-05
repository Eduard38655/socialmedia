import express from "express";
import getProfile from "../controller/profile/getProfile.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/profile", TokenVerifyAuth, getProfile);

export default router;