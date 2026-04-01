import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageInput from "../../Components/messages/MessageInput.jsx";
import MessageItem from "../../Components/messages/MessageItem.jsx";
import { UserSidebarContext } from "../../Context/UserSidebarContext.jsx";
import useUpdateMessage from "../../hook/messages/useUpdateMessage.jsx";
import styles from "../../Styles/ChatScreen.module.css";
import dayjs from "../../utils/day.js";
import { socket } from "../../utils/socket.js";
import SideBarMembers from "../Channel/SidebarMembers.jsx";
function GroupMessages() {
  const { ShowSidebar } = useContext(UserSidebarContext);
  const { channelid } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // RECIBIR MENSAJES
  useEffect(() => {
    function handleReceive(data) {
      setMessages((prev) => [...prev, data]);
    }

    socket.on("receive_message_room", handleReceive);
    return () => socket.off("receive_message_room", handleReceive);
  }, []);

  // ENTRAR AL CHANNEL
  useEffect(() => {
    if (!channelid) return;
    socket.emit("join_channel", { channelid });
    return () => socket.emit("leave_channel", { channelid });
  }, [channelid]);

  // CARGAR MENSAJES
  useEffect(() => {
    if (!channelid) return;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Get_channel_messages/${channelid}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al cargar mensajes");
        const data = await res.json();
        if (data.ok) setMessages(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [channelid]);

  function handleSend() {
    if (!message.trim()) return;
    socket.emit("send_message_room", { message, channelid });
    setMessage("");
  }

  function goToDM(receiverid) {
    fetch(`${import.meta.env.VITE_API_URL}/private/Start_Message_ByID/${receiverid}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => navigate(`/dashboard/@me/message/${receiverid}`))
      .catch(console.error);
  }
  /*
    async function handleUpdate(id) {
      if (!editText.trim()) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Update_Direct_Messages/${id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: editText }),
          }
        );
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
      } catch (error) {
        console.error(error);
      }
    }*/
  const handleUpdate = useUpdateMessage(
    setMessages, editText, setEditId, setEditText,
    "/private/Update_channel_messages" // ✅
  );
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/private/Delete_channel_messages/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (data.ok) setMessages((prev) => prev.filter((msg) => (msg.messageid ?? msg.id) !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <article className={styles.container_NewMessage_chat}>
      <div className={styles.Infocontainer_messages}>
        <div className={styles.container_messages_chat_container}>
          {messages.filter((msg) => msg.message?.trim()).map((msg, index) => {
            const id = msg.messageid ?? msg.id ?? `${index}`;
            const user = msg.users;
            const time = msg.updated_at
              ? `Updated ${dayjs(msg.updated_at).fromNow()}`
              : dayjs(msg.created_at).fromNow();

            return (
              <MessageItem
                key={id}
                msg={msg}
                msgId={id}
                user={user}
                time={time}
                editId={editId}
                editText={editText}
                onEditChange={(e) => setEditText(e.target.value)}
                onSave={() => handleUpdate(id)}
                onCancelEdit={() => { setEditId(null); setEditText(""); }}
                openMenuId={openMenuId}
                onToggleMenu={() => setOpenMenuId((prev) => prev === id ? null : id)}
                onEdit={() => { setEditId(id); setEditText(msg.message); setOpenMenuId(null); }}
                onDelete={() => { if (confirm("¿Eliminar mensaje?")) handleDelete(id); }}
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

      {ShowSidebar && <SideBarMembers />}
    </article>
  );
}

export default GroupMessages; 