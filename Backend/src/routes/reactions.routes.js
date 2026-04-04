// reactions.routes.js
import express from "express";
import { getReactions } from "../controller/Reactions.controller.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/", TokenVerifyAuth, getReactions);

export default router;