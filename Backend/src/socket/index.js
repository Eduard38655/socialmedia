import directMessagesSocket from "../../src/socket/directMessagesInfo.js";
import channelMessagesSocket from "./channelMessages.socket.js";
import reactionsSocket from "./reactions.socket.js";

export default function registerSockets(io, socket, userId) {
  directMessagesSocket(io, socket, userId);
  channelMessagesSocket(io, socket, userId);
  reactionsSocket(io, socket, userId);
}