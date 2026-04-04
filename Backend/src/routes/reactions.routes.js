// reactions.routes.js
import express from "express";
import { getReactions } from "../controller/Reactions.controller.js";
import { postReactions } from "../controller/ReactToPost.controller.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/", TokenVerifyAuth, getReactions);
router.patch("/", TokenVerifyAuth, postReactions);
export default router;
