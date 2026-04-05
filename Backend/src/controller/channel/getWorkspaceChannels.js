import db from "../../../prisma/db.js";

export default async function getWorkspaceChannels(req, res) {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
    const { groupid } = req.params;

    if (!userid) {
      return res.status(400).json({
        ok: false,
        message: "No user id available",
      });
    }

    const data = await db.workspaces.findMany({
      where: { workspaceid: Number(groupid) },
      include: {
        channel_sections: {
          include: {
            channels: true,
          },
        },
      },
    });

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
}