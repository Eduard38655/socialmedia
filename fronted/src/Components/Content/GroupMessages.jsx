import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserSidebarContext } from "../../Context/UserSidebarContext.jsx";
import styles from "../../Styles/ChatScreen.module.css";
import dayjs from "../../utils/day.js";
import { socket } from "../../utils/socket.js";
import SideBarMembers from "../Channel/SidebarMembers.jsx";
import OptionsMessages from "../Chat/OptionsMessages.jsx";

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
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message_room", handleReceive);

    return () => {
      socket.off("receive_message_room", handleReceive);
    };
  }, []);


  // ENTRAR AL CHANNEL

  useEffect(() => {
    if (!channelid) return;

    socket.emit("join_channel", { channelid });

    return () => {
      socket.emit("leave_channel", { channelid });
    };
  }, [channelid]);


  // ENVIAR MENSAJE

  function SendMessage() {
    if (!message.trim()) return;

    socket.emit("send_message_room", {
      message,
      channelid,
    });

    setMessage("");
  }


  // CARGAR MENSAJES

  useEffect(() => {
    async function GetChannelMessages() {
      try {
        const response = await fetch(
          `http://localhost:3000/private/Get_channel_messages/${channelid}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (data.ok) {
          setMessages(data.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (channelid) {
      GetChannelMessages();
    }
  }, [channelid]);


  // IR A DM

  function Info(receiverid) {
    fetch(`http://localhost:3000/private/Start_Message_ByID/${receiverid}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        navigate(`/dashboard/@me/message/${receiverid}`);
      })
      .catch(console.error);
  }


  // EDITAR MENSAJE

  async function handleUpdateMessage(id) {
    if (!editText.trim()) return;

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
            (msg.messageid ?? msg.id) === id
              ? {
                ...msg,
                message: editText,
                updated_at: new Date().toISOString(),
              }
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


  // ELIMINAR MENSAJE

  async function handleDeleteMessage(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/private/Delete_channel_messages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.ok) {
        setMessages((prev) =>
          prev.filter((msg) => (msg.messageid ?? msg.id) !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <article className={styles.container_NewMessage_chat}>
      <div className={styles.Infocontainer_messages}>
        {/* ===================== MESSAGES ===================== */}
        <div className={styles.container_messages_chat_container}>
          {(messages || []).filter(Boolean).map((msg, index) => {
            const id = msg.messageid ?? msg.id ?? `${index}`;
            const user = msg.users;

            const time = msg.updated_at
              ? `Updated ${dayjs(msg.updated_at).fromNow()}`
              : dayjs(msg.created_at).fromNow();

            if (!msg.message?.trim()) return null;

            return (
              <div key={id} className={styles.Container_Messageid}>
                <div className={styles.message_container_details}>
                  <img
                    className={styles.message_avatar}
                    src={user?.img || "/default-avatar.png"}
                    alt="avatar"
                    onClick={() => Info(user?.userid)}
                  />

                  <div className={styles.message_div}>
                    <p>
                      {user?.name} {user?.last_name}{" "}
                      <small>{time}</small>
                    </p>

                    <div className={styles.messageText}>
                      {editId === id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleUpdateMessage(id);
                            if (e.key === "Escape") {
                              setEditId(null);
                              setEditText("");
                            }
                          }}
                        />
                      ) : (
                        msg.message
                      )}
                    </div>

                    {editId === id && (
                      <div className={styles.editActions}>
                        <button onClick={() => handleUpdateMessage(id)}>
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

                  {/* BOTÓN OPCIONES */}
                  <button
                    className={styles.btn_ellipsis}
                    onClick={() =>
                      setOpenMenuId((prev) =>
                        prev === id ? null : id
                      )
                    }
                  >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </div>

                {/* MENU */}
                {openMenuId === id && (
                  <OptionsMessages
                    dataUserId={user?.userid}
                    onEdit={() => {
                      setEditId(id);
                      setEditText(msg.message);
                      setOpenMenuId(null);
                    }}
                    onDelete={() => {
                      if (confirm("¿Eliminar mensaje?")) {
                        handleDeleteMessage(id);
                      }
                    }}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ===================== INPUT ===================== */}
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
                <button type="button">
                  <i className="fa-solid fa-video"></i>
                </button>
                <button type="button">
                  <i className="fa-regular fa-face-smile"></i>
                </button>
                <button type="button">
                  <i className="fa-solid fa-paperclip"></i>
                </button>
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

      {ShowSidebar && <SideBarMembers />}
    </article>
  );
}

export default GroupMessages;