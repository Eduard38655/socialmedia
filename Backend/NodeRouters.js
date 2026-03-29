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
import ProfileModel from "./src/models/Profile.model.js";
import userdataModel from "./src/models/userdata.model.js";
import WorkSpaceModel from "./src/models/WorkSpace.model.js";

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://eduard38655.github.io",
  "https://Eduard38655.github.io",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://eduard38655.github.io/socialmedia/",
  "https://socialmedia-khe0.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Socket.io ────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// Helper fuera del handler — se define una sola vez
function getChatRoom(a, b) {
  const [x, y] = [String(a), String(b)].sort();
  return `chat_${x}_${y}`;
}

io.on("connection", async (socket) => {
  // Verificar token
  const token = socket.handshake.headers.cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return socket.disconnect();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return socket.disconnect();
  }

  const userId = decoded.userid;
  console.log("Usuario conectado:", socket.id, "| userId:", userId);

  // Room personal del usuario
  socket.join(String(userId));

  // ── Direct messages ──────────────────────────────────────
  socket.on("join_room", ({ receiverId }) => {
    const room = getChatRoom(userId, receiverId);
    socket.join(room);
    console.log(`join_room: ${socket.id} → room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const receiverId = Number(data.receiverId);
      const room = getChatRoom(userId, receiverId);

      // Incluir datos del sender para que el frontend los tenga en tiempo real
      const savedMessage = await db.direct_messages.create({
        data: {
          message: data.message,
          sender_id: Number(userId),
          receiver_id: receiverId,
          created_at: new Date(),
          updated_at: new Date(),
        },
        include: {
          users_direct_messages_sender_idTousers: true,
        },
      });

      io.to(room).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("send_message error:", error);
    }
  });

  // ── Channel messages ─────────────────────────────────────
  socket.on("join_channel", ({ channelid }) => {
    if (!channelid) return;
    const room = `channel_${channelid}`;
    socket.join(room);
    console.log(`join_channel: ${socket.id} → room: ${room}`);
  });

  socket.on("send_message_room", async (data) => {
    try {
      const channelId = Number(data.channelid);
      if (!channelId) return console.warn("send_message_room sin channelid", data);

      // Incluir datos del usuario para que el frontend los tenga en tiempo real
      const savedMessage = await db.messages.create({
        data: {
          channelid: channelId,
          status: "unread",
          userid: userId,
          message: data.message,
          created_at: new Date(),
          updated_at: new Date(),
        },
        include: {
          users: true,
        },
      });

      io.to(`channel_${channelId}`).emit("receive_message_room", {
        ...savedMessage,
        channelid: channelId,
      });
    } catch (error) {
      console.error("send_message_room error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// ── Rutas HTTP ───────────────────────────────────────────────
app.use("/public", loginModel);
app.use("/private", userdataModel);
app.use("/private", ChannelsModel);
app.use("/private", WorkSpaceModel);
app.use("/private", ChatsMessagesListModel);
app.use("/private", SendDirectMessage);
app.use("/private", DeleteMessage);
app.use("/private", PutMessage);
app.use("/private", Update_Group_Messages);
app.use("/private", ProfileModel);

app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "servidor funcionando" });
});

// Static al final para no interceptar rutas API
app.use(express.static(path.join(__dirname, "dist")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});