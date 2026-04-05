import express from "express";
import getWorkspaceMembers from "../controller/workspace/getWorkspaceMembers.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/workspace_members", TokenVerifyAuth, getWorkspaceMembers);

export default router;