import db from "../../../prisma/db.js";

export default async function getChannelMembersWithGroup(req, res) {
  try {
    const { groupid } = req.params;

    const data = await db.channels.findMany({
      where: { workspaceid: Number(groupid) },
      include: {
        channels: true,
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

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}