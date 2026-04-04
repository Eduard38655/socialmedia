import express from "express";
import { getReactions } from "../controller/Reactions.controller";

const router = express.Router();

router.get("/", getReactions);
 

export default router;