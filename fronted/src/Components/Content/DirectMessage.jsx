import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MessageInput from "../../Components/messages/MessageInput.jsx";
import MessageItem from "../../Components/messages/MessageItem.jsx";
import { UserDataContext } from "../../Context/UserDataContext.jsx";
import useDeleteMessage from "../../hook/messages/useDeleteMessage.jsx";
import useUpdateMessage from "../../hook/messages/useUpdateMessage.jsx";
import styles from "../../Styles/ChatScreen.module.css";
import dayjs from "../../utils/day.js";
import { socket } from "../../utils/socket.js";
function DirectMessage() {
  const { senderid } = useParams();
  const { Profile } = useContext(UserDataContext);
  const myUserId = Profile?.[0]?.userid;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDelete = useDeleteMessage(setMessages);
  // RECIBIR MENSAJES
  useEffect(() => {
    function handleReceive(data) {
      if (data.sender_id == senderid || data.receiver_id == senderid) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === data.id);
          return exists ? prev : [...prev, data];
        });
      }
    }

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [senderid]);

  // ENTRAR AL ROOM
  useEffect(() => {
    if (!senderid || !myUserId) return;

    socket.emit("join_room", { receiverId: senderid, userId: myUserId });
    return () => socket.emit("leave_room", { receiverId: senderid, userId: myUserId });
  }, [senderid, myUserId]);

  // CARGAR MENSAJES
  useEffect(() => {
    if (!senderid) return;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Direct_Messages/${senderid}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al cargar mensajes");
        const data = await res.json();
        if (data.ok) setMessages(data.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [senderid]);

  function handleSend() {
    if (!message.trim()) return;
    socket.emit("send_message", { message: message.trim(), receiverId: senderid });
    setMessage("");
  }

  const handleUpdate = useUpdateMessage(
    setMessages, editText, setEditId, setEditText,
    "/private/Update_Direct_Messages" // ✅
  );


  return (
    <article className={styles.container_NewMessage_chat}>
      <div className={styles.Infocontainer_messages}>
        <div className={styles.container_messages_chat_container}>
          {messages.filter((msg) => msg.message?.trim()).map((msg, index) => {
            const user = msg.users_direct_messages_sender_idTousers;
            const time = msg.updated_at
              ? `Updated ${dayjs(msg.updated_at).fromNow()}`
              : dayjs(msg.created_at).fromNow();

            return (
              <MessageItem
                key={msg.id ?? `${msg.sender_id}-${index}`}
                msg={msg}
                msgId={msg.id}
                user={user}
                time={time}
                editId={editId}
                editText={editText}
                onEditChange={(e) => setEditText(e.target.value)}
                onSave={() => handleUpdate(msg.id)}
                onCancelEdit={() => { setEditId(null); setEditText(""); }}
                openMenuId={openMenuId}
                onToggleMenu={() => setOpenMenuId((prev) => prev === msg.id ? null : msg.id)}
                onEdit={() => { setEditId(msg.id); setEditText(msg.message); setOpenMenuId(null); }}
                onDelete={() => { if (confirm("¿Eliminar mensaje?")) { handleDelete(msg.id); setOpenMenuId(null); } }}
                onClose={() => setOpenMenuId(null)}
              />
            );
          })}
        </div>

        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onSend={handleSend}
        />
      </div>
    </article>
  );
}

export default DirectMessage;