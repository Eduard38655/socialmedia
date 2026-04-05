import db from "../../../prisma/db.js";

export default async function getDirectMessagesById(req, res) {
  try {
    const { senderid } = req.params;
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    const messages = await db.direct_messages.findMany({
      where: {
        OR: [
          {
            sender_id: Number(userid),
            receiver_id: Number(senderid),
          },
          {
            sender_id: Number(senderid),
            receiver_id: Number(userid),
          },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        users_direct_messages_sender_idTousers: {
          select: {
            userid: true,
            name: true,
            img: true,
            last_name: true,
          },
        },
      },
    });

    return res.status(200).json({
      ok: true,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}