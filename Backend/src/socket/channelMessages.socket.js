import db from "../../prisma/db.js";

export default function channelMessagesSocket(io, socket, userId) {
  socket.on("join_channel", ({ channelid }) => {
    if (!channelid) return;

    const room = `channel_${channelid}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined channel room: ${room}`);
  });

  socket.on("send_message_room", async (data) => {
    const channelId = Number(data.channelid);

    if (!channelId) {
      console.warn("send_message_room without channelid", data);
      return;
    }

    const saveMessage = await db.messages.create({
      data: {
        channelid: channelId,
        status: "unread",
        userid: userId,
        message: data.message,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const room = `channel_${channelId}`;

    io.to(room).emit("receive_message_room", {
      ...saveMessage,
      channelid: channelId,
    });
  });
}