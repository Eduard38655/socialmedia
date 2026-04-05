import express from "express";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

import getDirectMessages from "../controller/Direct_messages/getDirectMessages.js";
import getDirectMessagesById from "../controller/Direct_messages/getDirectMessagesById.js";

const router = express.Router();

router.get("/Direct_Messages", TokenVerifyAuth, getDirectMessages);
router.get(
  "/Direct_Messages/:senderid",
  TokenVerifyAuth,
  getDirectMessagesById,
);

export default router;
