import jwt from "jsonwebtoken";

export function getUserIdFromSocket(socket) {
  const cookies = socket.handshake.headers.cookie;

  const cookieToken = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  const authToken = socket.handshake.auth?.token;
  const token = authToken || cookieToken;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userid;
  } catch (error) {
    return null;
  }
}