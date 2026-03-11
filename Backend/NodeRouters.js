import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import db from "../Backend/prisma/db.js";
import ChannelsModel from "./src/models/Channels.model.js";
import ChatsMessagesListModel from "./src/models/ChatsMessagesList.model.js";
import loginModel from "./src/models/login.model.js";
import userdataModel from "./src/models/userdata.model.js";
import WorkSpaceModel from "./src/models/WorkSpace.model.js";
const app = express();

const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
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





 const userId = decoded.userid;

  console.log("Usuario conectado:", userId);

  // ROOM PERSONAL
  socket.join(String(userId));

  // ENVIAR MENSAJE
  socket.on("send_message", (data) => {

    const receiverId = data.receiverId;

    console.log("Mensaje de", userId, "para", receiverId);

    io.to(String(receiverId)).emit("receive_message", {
      message: data.message,
      senderId: userId
    });

  });

  
 
 







  ////////////////////////////////////////////
  socket.on("GetMessageByID", async (id) => {
    try {
      console.log("personal", id);
      
      const message = await db.direct_messages.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          users_direct_messages_sender_idTousers: true,
        },
      });

      socket.emit("MessagesResult", {
        ok: true,
        data: message,
      });
    } catch (error) {
      console.log(error);
    }
  });
 
  

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use("/public", loginModel);
app.use("/private", userdataModel);
app.use("/private", ChannelsModel);
app.use("/private", WorkSpaceModel);
app.use("/private", ChatsMessagesListModel);
// Levantar servidor
server.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
