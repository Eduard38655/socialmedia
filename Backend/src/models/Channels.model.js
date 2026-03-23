// src/models/userdata.model.js
import express from "express";
import db from "../../prisma/db.js";
import TokenVerifyAuth from "../middleware/TokenVerify.auth.js";

const router = express.Router();

router.get("/channel_members/:groupid", TokenVerifyAuth, async (req, res) => {
  try {
    // Intenta obtener userid de req.user o de req.login como fallback
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
    const { groupid } = req.params;
    console.log(groupid, "dd");

    if (!userid) {
      return res
        .status(400)
        .json({ ok: false, message: "No user id available" });
    }

    const workspace_members_Data = await db.workspaces.findMany({
      where: { workspaceid: Number(groupid) },
      include: {
        channel_sections: {
          include: {
            channels: true,
          },
        },
      },
    });
    console.log(workspace_members_Data);

    return res.status(200).json({ ok: true, data: workspace_members_Data });
  } catch (error) {
    console.error("workspace_members error:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

//**Obtener todos los miembros de un canal */
router.get(
  "/Getchannel_members/:channelid/:groupid",
  TokenVerifyAuth,
  async (req, res) => {
    try {
      const { channelid, groupid } = req.params;

      const channel_members_data = await db.channels.findMany({
        where: { workspaceid: Number(groupid) },
        include: {
          channels: true,
        },
        include: {
          users: {
            select: {
              userid: true,
              name: true,
              img: true,
              last_name: true,
            },
          },
        },
      });

      return res.status(200).json({ ok: true, data: channel_members_data });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error" });
    }
  },
);

router.get(
  "/Get_channel_messages/:channelid",
  TokenVerifyAuth,
  async (req, res) => {
    try {
      const { channelid } = req.params;
      console.log("channelid", channelid, "channelid");

      const channel_members_messages_data = await db.messages.findMany({
        where: {
          channelid: Number(channelid),
        },
        include: {
          users: {
            select: {
              userid: true,
              name: true,
              img: true,
              last_name: true,
            },
          },
        },
      });
      console.log(channel_members_messages_data);

      return res
        .status(200)
        .json({ ok: true, data: channel_members_messages_data });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error" });
    }
  },
);

router.get(
  "/Get_channel_members/:channelid",
  TokenVerifyAuth,
  async (req, res) => {
    try {
      const { channelid } = req.params;
      const GlobalUsers = await db.workspace_members.findMany({
        where: { workspaceid: Number(channelid) },
        include: {
          users: {
            select: {
              userid: true,
              name: true,
              img: true,
              last_name: true,
              status: true,
            },
          },
        },
      });

      return res.status(200).json({ ok: true, data: GlobalUsers });
    } catch (error) {
      console.error(error);
      return res
        .status(404)
        .json({ Error: "There was an error connectin to the server" });
    }
  },
);

export default router;
