import { io } from "socket.io-client";

const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const socket = io(backendUrl, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect_error", (err) => {
  console.error("Socket connect error:", err.message);
});

socket.on("connect", () => {
  console.log("Socket connected", socket.id, "to", backendUrl);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});