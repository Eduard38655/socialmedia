import db from "../../../prisma/db.js";

export default async function getDirectMessages(req, res) {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no autenticado",
      });
    }

    const messages = await db.direct_messages.findMany({
      where: {
        OR: [{ sender_id: userid }, { receiver_id: userid }],
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        users_direct_messages_sender_idTousers: {
          include: { logins: true },
        },
        users_direct_messages_receiver_idTousers: {
          include: { logins: true },
        },
      },
    });

    const profileData = await db.users.findUnique({
      where: { userid },
    });

    const uniqueUsers = [
      ...new Map(
        messages.map((msg) => {
          const otherUser =
            msg.sender_id === userid
              ? msg.users_direct_messages_receiver_idTousers
              : msg.users_direct_messages_sender_idTousers;

          return [otherUser?.userid, otherUser];
        }),
      ).values(),
    ];

    return res.status(200).json({
      ok: true,
      data: uniqueUsers,
      profileData,
      messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}