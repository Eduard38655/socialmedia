import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageInput from "../../Components/messages/MessageInput.jsx";
import MessageItem from "../../Components/messages/MessageItem.jsx";
import { UserSidebarContext } from "../../Context/UserSidebarContext.jsx";
import useDeleteMessage from "../../hook/messages/useDeleteMessage.jsx";
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
  const [usersCache, setUsersCache] = useState({});

  // ✅ RECIBIR MENSAJES
  useEffect(() => {
    function handleReceive(data) {
      setMessages((prev) => [...prev, data]);

      // guardar usuario en cache
      if (data.users?.userid) {
        setUsersCache((prev) => ({
          ...prev,
          [data.users.userid]: data.users,
        }));
      }
    }

    socket.on("receive_message_room", handleReceive);
    return () => socket.off("receive_message_room", handleReceive);
  }, []);

 
  // ✅ ENTRAR AL CHANNEL
  useEffect(() => {
    if (!channelid) return;

    socket.emit("join_channel", { channelid });

    return () => socket.emit("leave_channel", { channelid });
  }, [channelid]);

  // ✅ CARGAR MENSAJES (SOLO CHANNEL)
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

        if (data.ok) {
          console.log(data, "detailsx");

          setMessages(data.data || []);

          const cache = {};
          (data.data || []).forEach((msg) => {
            const u = msg.users;
            if (u?.userid) {
              cache[u.userid] = u;
            }
          });

          setUsersCache(cache);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [channelid]);

  // ✅ ENVIAR MENSAJE
  function handleSend() {
    if (!message.trim()) return;

    socket.emit("send_message_room", {
      message,
      channelid,
      
      
    });

    setMessage("");
  }

  // ✅ IR A DM
  function goToDM(receiverid) {
    console.log(receiverid, "dd");

    fetch(
      `${import.meta.env.VITE_API_URL}/private/Start_Message_ByID/${receiverid}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(() => navigate(`/dashboard/@me/message/${receiverid}`))
      .catch(console.error);
  }

  const handleUpdate = useUpdateMessage(
    setMessages,
    editText,
    setEditId,
    setEditText,
    "/private/Update_channel_messages"
  );

  const handleDelete = useDeleteMessage(
    setMessages,
    "/private/Delete_channel_messages"
  );// ✅ Un único useEffect para reacciones

  
useEffect(() => {
  function handleReaction(data) {
    console.log("LLEGO REACTION:", data);

    setMessages((prev) =>
      prev.map((msg) => {
        if (Number(msg.messageid) !== Number(data.msgId)) return msg;

        return {
          ...msg,
          reactions: [
            ...(msg.reactions || []),
            {
              reactionid: data.reactionid,
              emoji: data.emoji,
              userid: data.userid,
            },
          ],
        };
      })
    );
  }

  socket.on("receive_emoji_message_room", handleReaction);
  return () => socket.off("receive_emoji_message_room", handleReaction);
}, []);
  return (
    <article className={styles.container_NewMessage_chat}>
      <div className={styles.Infocontainer_messages}>
        <div className={styles.container_messages_chat_container}>
          {messages
            .filter((msg) => msg.message?.trim())
            .map((msg, index) => {
              const id = msg.messageid ?? msg.id ?? `${index}`;

              const user = msg.users ?? usersCache[msg.sender_id];
              const user_Reactions = msg.reactions
              const time = msg.updated_at
                ? `Updated ${dayjs(msg.updated_at).fromNow()}`
                : dayjs(msg.created_at).fromNow();

              return (
                <MessageItem
                  key={id}
                  msg={msg}
                  msgId={id}
                  user={user}
                 setMessages={setMessages}
                 setUsersCache={setUsersCache}
                  user_Reactions={user_Reactions}
                  time={time}
                  editId={editId}
                  editText={editText}
                  onEditChange={(e) => setEditText(e.target.value)}
                  onSave={() => handleUpdate(id)}
                  onCancelEdit={() => {
                    setEditId(null);
                    setEditText("");
                  }}
                  openMenuId={openMenuId}
                  onToggleMenu={() =>
                    setOpenMenuId((prev) =>
                      prev === id ? null : id
                    )
                  }
                  onEdit={() => {
                    setEditId(id);
                    setEditText(msg.message);
                    setOpenMenuId(null);
                  }}
                  onDelete={() => {
                    if (confirm("¿Eliminar mensaje?")) {
                      handleDelete(id);
                    }
                  }}
                  onClose={() => setOpenMenuId(null)}

                />
              );
            })}
          <MessageInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={handleSend}
          />
        </div>

      </div>

      {ShowSidebar && <SideBarMembers />}
    </article>
  );
}

export default GroupMessages;