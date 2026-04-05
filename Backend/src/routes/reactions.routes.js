// reactions.routes.js
import express from "express";
import { getReactions } from "../controller/Reactions.controller.js";
import { postReactions } from "../controller/ReactToPost.controller.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

import getChannelMembers from "../controller/channel/getChannelMembers.js";
import getChannelMembersWithGroup from "../controller/channel/getChannelMembersWithGroup.js";
import getChannelMessages from "../controller/channel/getChannelMessages.js";
import getWorkspaceChannels from "../controller/channel/getWorkspaceChannels.js";

const router = express.Router();

router.get("/channel_members/:groupid", TokenVerifyAuth, getWorkspaceChannels);

router.get(
  "/Getchannel_members/:channelid/:groupid",
  TokenVerifyAuth,
  getChannelMembersWithGroup,
);

router.get(
  "/Get_channel_messages/:channelid",
  TokenVerifyAuth,
  getChannelMessages,
);

router.get(
  "/Get_channel_members/:channelid",
  TokenVerifyAuth,
  getChannelMembers,
);

/*Reactiones Routes */
router.get("/", TokenVerifyAuth, getReactions);
router.post("/", TokenVerifyAuth, postReactions);

/**/

export default router;
