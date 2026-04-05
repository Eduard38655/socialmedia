import db from "../../../prisma/db.js";

export default async function getChannelMessages(req, res) {
  try {
    const { channelid } = req.params;

    const data = await db.messages.findMany({
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
        reactions: true,
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