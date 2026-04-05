import db from "../../../prisma/db.js";

export default async function getChannelMembers(req, res) {
  try {
    const { channelid } = req.params;

    const data = await db.workspace_members.findMany({
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

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      ok: false,
      message: "There was an error connecting to the server",
    });
  }
}