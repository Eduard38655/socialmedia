import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import GroupMessagesDelete from "../Backend/src/Messages/GroupMessages/DeleteMessage.js";
import GroupMessages from "../Backend/src/Messages/GroupMessages/PutMessage.js";
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
import Reactions_Routes from "./src/routes/reactions.routes.js";
const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist"))); // o el nombre real de tu carpeta

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
    console.log("ORIGIN:", origin); // ← agrega esto
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.options("/*", cors(corsOptions)); // no se usa: app.use(cors()) cubre preflight en Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
const io = new Server(server, {
  cors: {
    origin: [
      "https://eduard38655.github.io",
      "https://Eduard38655.github.io",
      "http://localhost:3000",
      "http://localhost:5173",
      "https://eduard38655.github.io/socialmedia/",
      "https://socialmedia-khe0.onrender.com",
    ],
    credentials: true,
  },
});
io.on("connection", async (socket) => {
  const cookies = socket.handshake.headers.cookie;

  const cookieToken = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  const authToken = socket.handshake.auth?.token;
  const token = authToken || cookieToken;

  if (!token) {
    console.error("Socket auth failed: no token");
    socket.disconnect();
    return;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Socket auth failed: token invalid", error.message);
    socket.disconnect();
    return;
  }

  console.log("Usuario conectado:", socket.id);

  function getChatRoom(a, b) {
    const [x, y] = [String(a), String(b)].sort();
    return `chat_${x}_${y}`;
  }

  console.log(decoded);

  const userId = decoded.userid;

  // room personal del usuario
  socket.join(String(userId));

  socket.on("join_room", ({ receiverId }) => {
    const room = getChatRoom(userId, receiverId);

    socket.join(room);

    console.log("User joined room:", room);
  });

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
      channelid: channelId,
    });
  });
  


  socket.on("send_emoji_message_room", async (data) => {
  try {
    if (!data.msgId || !data.emoji || !data.channelid) return;

    const channelId = Number(data.channelid);
    const messageId = Number(data.msgId);

    // Toggle: quitar si ya existe, agregar si no
    const existing = await db.reactions.findFirst({
      where: { userid: userId, messageid: messageId, emoji: data.emoji },
    });

    if (existing) {
      await db.reactions.delete({ where: { reactionid: existing.reactionid } });
    } else {
      await db.reactions.create({
        data: { userid: userId, messageid: messageId, emoji: data.emoji, created_at: new Date() },
      });
    }

    // Agrupar y emitir el estado real desde la DB
    const grouped = await db.reactions.groupBy({
      by: ["emoji"],
      where: { messageid: messageId },
      _count: { emoji: true },
    });

    io.to(`channel_${channelId}`).emit("receive_emoji_message_room", {
      msgId: messageId,
      channelid: channelId,
      reactions: grouped.map(r => ({ emoji: r.emoji, count: r._count.emoji })),
    });

  } catch (err) {
    console.error("Error en send_emoji_message_room:", err);
    socket.emit("error_emoji", { message: "No se pudo procesar la reacción" });
  }
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
app.use("/private", ProfileModel);
app.use("/private", GroupMessages);
app.use("/private", GroupMessagesDelete);

/*organisada */
app.use("/private/reactions", Reactions_Routes);
app.use("/private/react_message", Reactions_Routes);

// Levantar servidor
/**

app.get("/ping", (req, res) => {
  res.json({ 
    ok: true, 
    message: "servidor funcionando",
    rutas_registradas: ["/public/login", "/public/logout"]
  });
});
 * 
 */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
