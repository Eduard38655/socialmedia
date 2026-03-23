import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserDataContext } from "../../Context/UserDataContext.jsx";
import styles from "../../Styles/ChatScreen.module.css";
import dayjs from "../../utils/day.js";
import { socket } from "../../utils/socket.js";
import OptionsMessages from "../Chat/OptionsMessages.jsx";
function DirectMessage() {
  const { senderid } = useParams();

  const { Profile } = useContext(UserDataContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // RECIBIR MENSAJES
  useEffect(() => {
    function handleReceive(data) {
      if (data.sender_id == senderid || data.receiver_id == senderid) {
        setMessages((prev) => [...prev, data]);
      }
    }

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [senderid]);

  // ENTRAR AL ROOM
  useEffect(() => {
    const id = Profile[0].userid
    if (!senderid || !id) return;

    const room = `chat_${[id, senderid].sort().join("_")}`;

    socket.emit("join_room", {
      receiverId: senderid,
    });

    return () => {
      socket.emit("leave_room", room);
    };
  }, [senderid, Profile]);

  // ENVIAR MENSAJE
  function SendMessage() {
    if (!message.trim()) return;

    socket.emit("send_message", {
      message: message,
      receiverId: senderid,
    });

    setMessage("");
  }

  // CARGAR MENSAJES HISTÓRICOS
  useEffect(() => {
    async function GetDataMessageByID() {
      try {
        const response = await fetch(
          `http://localhost:3000/private/Direct_Messages/${senderid}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();


        if (data.ok) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (senderid) {
      GetDataMessageByID();
    }
  }, [senderid]);


  // EDITAR MENSAJE
  async function handleUpdateMessage(id) {
    try {

      const response = await fetch(
        `http://localhost:3000/private/Update_Direct_Messages/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: editText,
          }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
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
  }

  async function handleDeleteMessage(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/private/Delete_Direct_Messages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.ok) {
        // 🔥 quitar del estado
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <article className={styles.container_NewMessage_chat}>
      <div className={styles.Infocontainer_messages}>
        <div className={styles.container_messages_chat_container}>
          {messages.map((msg, index) => {
            const user = msg.users_direct_messages_sender_idTousers;

            const time = msg.updated_at
              ? `Updated ${dayjs(msg.updated_at).fromNow()}`
              : dayjs(msg.created_at).fromNow();

            if (msg.message === "") return null;

            return (
              <div
                className={styles.Container_Messageid}
                key={msg.id ?? `${msg.sender_id}-${index}`}
              >
                <div className={styles.message_container_details}>
                  <img
                    src={user?.img}
                    alt="avatar"
                    className={styles.message_avatar}
                  />

                  <div className={styles.message_div}>
                    <p>
                      {user?.name} {user?.last_name} <small>{time}</small>
                    </p>

                    <div className={styles.messageText}>
                      {editId === msg.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      ) : (
                        msg.message
                      )}
                    </div>

                    {editId === msg.id && (
                      <div className={styles.editActions}>
                        <button onClick={() => handleUpdateMessage(msg.id)}>
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditText("");
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    className={styles.btn_ellipsis}
                    onClick={() => {
                      setOpenMenuId((prev) => (prev === msg.id ? null : msg.id));
                    }}
                  >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </div>

                {openMenuId === msg.id && (
                  <OptionsMessages
                    dataUserId={user.userid}
                    onEdit={() => {
                      setEditId(msg.id);
                      setEditText(msg.message);
                      setOpenMenuId(null);
                    }}
                    onDelete={() => {
                      if (confirm("¿Eliminar mensaje?")) {
                        handleDeleteMessage(msg.id);
                      }
                    }}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <aside className={styles.Send_Message_container}>
          <div className={styles.Section_Icons}>
            <div className={styles.textarea_container}>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className={styles.Section_Icons_btn_2}>
              <div>
                <button><i className="fa-solid fa-video"></i></button>
                <button><i className="fa-regular fa-face-smile"></i></button>
                <button><i className="fa-solid fa-paperclip"></i></button>
              </div>

              <div className={styles.btn_send}>
                <i className="fa-solid fa-microphone"></i>
                <button onClick={SendMessage}>
                  <i className="fa-solid fa-paper-plane"></i> Send
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

export default DirectMessage;