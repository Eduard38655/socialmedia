import channelMessagesSocket from "./channelMessages.socket.js";
import directMessagesSocket from "./directMessagesInfo.socket.js";
import reactionsSocket from "./reactions.socket.js";

export default function registerSockets(io, socket, userId) {
  directMessagesSocket(io, socket, userId);
  channelMessagesSocket(io, socket, userId);
  reactionsSocket(io, socket, userId);
}