import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { getUserIdFromSocket } from "../Backend/src/socket/auth.socket.js";
import registerSockets from "../Backend/src/socket/index.js";

// tus imports de rutas...
import GroupMessagesDelete from "../Backend/src/Messages/GroupMessages/DeleteMessage.js";
import GroupMessages from "../Backend/src/Messages/GroupMessages/PutMessage.js";
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

app.use(express.static(path.join(__dirname, "dist")));

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
    console.log("ORIGIN:", origin);
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = getUserIdFromSocket(socket);

  if (!userId) {
    console.error("Socket auth failed");
    socket.disconnect();
    return;
  }

  console.log("Usuario conectado:", socket.id);
  socket.join(String(userId));

  registerSockets(io, socket, userId);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// rutas
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
app.use("/private/reactions", Reactions_Routes);
app.use("/private/react_message", Reactions_Routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});