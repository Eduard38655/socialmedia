import db from "../../prisma/db.js";

function getChatRoom(a, b) {
  const [x, y] = [String(a), String(b)].sort();
  return `chat_${x}_${y}`;
}

export default function directMessagesSocket(io, socket, userId) {
  socket.on("join_room", ({ receiverId }) => {
    const room = getChatRoom(userId, receiverId);
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("send_message", async (data) => {
    const receiverId = Number(data.receiverId);
    const room = getChatRoom(userId, receiverId);

    const saveMessage = await db.direct_messages.create({
      data: {
        message: data.message,
        sender_id: Number(userId),
        receiver_id: receiverId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    io.to(room).emit("receive_message", saveMessage);
  });
}