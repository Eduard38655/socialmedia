import { useEffect, useState } from "react";
import { socket } from "../utils/socket.js";

const API = import.meta.env.VITE_API_URL;

export function useGroupMessages(channelid) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Cargar mensajes cuando cambia el canal
  useEffect(() => {
    if (!channelid) return;

    async function getMessages() {
      const res = await fetch(`${API}/private/Get_channel_messages/${channelid}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) setMessages(data.data || []);
    }

    getMessages();
  }, [channelid]);

  // Unirse y salir del canal
  useEffect(() => {
    if (!channelid) return;
    socket.emit("join_channel", { channelid });
    return () => socket.emit("leave_channel", { channelid });
  }, [channelid]);

  // Recibir mensajes en tiempo real
  useEffect(() => {
    function onReceive(data) {
      setMessages((prev) => [...prev, data]);
    }
    socket.on("receive_message_room", onReceive);
    return () => socket.off("receive_message_room", onReceive);
  }, []);

  // Enviar mensaje
  function sendMessage() {
    if (!message.trim()) return;
    socket.emit("send_message_room", { message, channelid });
    setMessage("");
  }

  // Editar mensaje
  async function updateMessage(id) {
    if (!editText.trim()) return;

    const res = await fetch(`${API}/private/Update_Direct_Messages/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: editText }),
    });
    const data = await res.json();

    if (data.ok) {
      setMessages((prev) =>
        prev.map((msg) =>
          (msg.messageid ?? msg.id) === id
            ? { ...msg, message: editText, updated_at: new Date().toISOString() }
            : msg
        )
      );
      setEditId(null);
      setEditText("");
    }
  }

  // Eliminar mensaje
  async function deleteMessage(id) {
    const res = await fetch(`${API}/private/Delete_channel_messages/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok) {
      setMessages((prev) =>
        prev.filter((msg) => (msg.messageid ?? msg.id) !== id)
      );
    }
  }

  return {
    messages,
    message,
    setMessage,
    openMenuId,
    setOpenMenuId,
    editId,
    setEditId,
    editText,
    setEditText,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
}