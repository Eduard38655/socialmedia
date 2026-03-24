import jwt from "jsonwebtoken";
import db from "../../prisma/db.js";

export function initSocket(io) {
  io.on("connection", (socket) => {
    try {
      const cookies = socket.handshake.headers.cookie;

      const token = cookies
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

      if (!token) return socket.disconnect();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userid;

      socket.join(String(userId));

      // ================= DIRECT =================
      socket.on("join_room", ({ receiverId }) => {
        if (!receiverId) return;

        const room = getChatRoom(userId, receiverId);
        socket.join(room);
      });

      socket.on("send_message", async (data) => {
        try {
          if (!data.message || !data.receiverId) return;

          const receiverId = Number(data.receiverId);
          const room = getChatRoom(userId, receiverId);

          const msg = await db.direct_messages.create({
            data: {
              message: data.message,
              sender_id: userId,
              receiver_id: receiverId,
            },
          });

          io.to(room).emit("receive_message", msg);

        } catch (err) {
          console.error("Socket error:", err);
        }
      });

      // ================= CHANNEL =================
      socket.on("join_channel", ({ channelid }) => {
        if (!channelid) return;

        socket.join(`channel_${channelid}`);
      });

      socket.on("send_message_room", async (data) => {
        try {
          if (!data.message || !data.channelid) return;

          const channelId = Number(data.channelid);

          const msg = await db.messages.create({
            data: {
              channelid: channelId,
              userid: userId,
              message: data.message,
            },
          });

          io.to(`channel_${channelId}`).emit("receive_message_room", msg);

        } catch (err) {
          console.error("Channel socket error:", err);
        }
      });

    } catch (err) {
      console.error("Connection error:", err);
      socket.disconnect();
    }
  });
}

// helper
function getChatRoom(a, b) {
  return `chat_${[a, b].sort().join("_")}`;
}