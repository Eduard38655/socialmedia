import express from "express";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

import getDirectMessages from "../controller/Direct_messages/getDirectMessages.js";
import getDirectMessagesById from "../controller/Direct_messages/getDirectMessagesById.js";
import deleteGroupMessage from "../controller/Group_Messages/deleteGroupMessage.js";
import updateGroupMessage from "../controller/Group_Messages/updateGroupMessage.js";



const router = express.Router();

router.get("/Direct_Messages", TokenVerifyAuth, getDirectMessages);
router.get(
  "/Direct_Messages/:senderid",
  TokenVerifyAuth,
  getDirectMessagesById,
);


router.put(
  "/Update_Group_Messages/:messageid",
  TokenVerifyAuth,
  updateGroupMessage
);

router.delete(
  "/Delete_Group_Messages/:messageid",
  TokenVerifyAuth,
  deleteGroupMessage
);
export default router;
