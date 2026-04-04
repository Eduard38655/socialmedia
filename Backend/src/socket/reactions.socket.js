import db from "../../prisma/db.js";

export default function reactionsSocket(io, socket, userId) {
  socket.on("send_emoji_message_room", async (data) => {
    const channelId = Number(data.channelid);

    const result = await db.reactions.create({
      data: {
        userid: userId,
        messageid: Number(data.messageid),
        created_at: new Date(),
        emoji: data.emoji,
      },
    });

    const room = `channel_${channelId}`;

    io.to(room).emit("receive_emoji_message_room", {
      msgId: Number(data.messageid),
      emoji: data.emoji,
      reactionid: result.reactionid,
      userid: userId,
      channelid: channelId,
    });
  });
}