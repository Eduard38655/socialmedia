import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import db from "./prisma/db.js";
import Update_Group_Messages from "./src/GroupMessages/GroupMessages.js";
import DeleteMessage from "./src/Messages/DeleteMessage.js";
import SendDirectMessage from "./src/Messages/Messages.js";
import PutMessage from "./src/Messages/PutMessage.js";
import ChannelsModel from "./src/models/Channels.model.js";
import ChatsMessagesListModel from "./src/models/ChatsMessagesList.model.js";
import loginModel from "./src/models/login.model.js";
import userdataModel from "./src/models/userdata.model.js";
import WorkSpaceModel from "./src/models/WorkSpace.model.js";
const app = express();

const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "https://gorgeous-lebkuchen-0e9856.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "*"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: [
      "https://gorgeous-lebkuchen-0e9856.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  const cookies = socket.handshake.headers.cookie;

  const token = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    socket.disconnect();
    return;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    socket.disconnect();
    return;
  }

  console.log("Usuario conectado:", socket.id);
  function getChatRoom(a, b) {
    const [x, y] = [String(a), String(b)].sort();
    return `chat_${x}_${y}`;
  }
  const userId = decoded.userid;

  // room personal del usuario
  socket.join(String(userId));

  socket.on("join_room", ({ receiverId }) => {
    const room = getChatRoom(userId, receiverId);

    socket.join(room);

    console.log("User joined room:", room);
  });

  socket.on("send_message", async (data) => {
    const receiverId = Number(data.receiverId);

    const room = getChatRoom(userId, receiverId);

    const SaveMessages = await db.direct_messages.create({
      data: {
        message: data.message,
        sender_id: Number(userId),
        receiver_id: receiverId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    io.to(room).emit("receive_message", SaveMessages);
  });

  //////////////////////////////////////////////////////////////////////
socket.on("join_channel", ({ channelid }) => {
  if (!channelid) return;
  const room = `channel_${channelid}`;
  socket.join(room);
  console.log(`Socket ${socket.id} joined channel room: ${room}`);
});

 socket.on("send_message_room", async (data) => {
  // data.channelid es el id del channel
  const channelId = Number(data.channelid);

  if (!channelId) {
    console.warn("send_message_room without channelid", data);
    return;
  }

  // Guardar mensaje en la tabla de messages (ya lo tenías)
  const SaveMessages = await db.messages.create({
    data: {
      channelid: channelId,
      status: "unread",
      userid: userId,
      message: data.message,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Room del channel: channel_<id>
  const room = `channel_${channelId}`;

  // Emitir al evento que el cliente espera para channels
  io.to(room).emit("receive_message_room", {
    ...SaveMessages,
    channelid: channelId
  });
});

  //////////////////////////////////////////////////////
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use("/public", loginModel);
app.use("/private", userdataModel);
app.use("/private", ChannelsModel);
app.use("/private", WorkSpaceModel);
app.use("/private", ChatsMessagesListModel);
app.use("/private", SendDirectMessage);
app.use("/private", DeleteMessage);
app.use("/private", PutMessage);
app.use("/private", Update_Group_Messages);
// Levantar servidor

const PORT= process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
