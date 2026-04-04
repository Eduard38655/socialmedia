import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Styles/ChatScreen.module.css";
import { socket } from "../../utils/socket.js";
import OptionsMessages from "../Chat/OptionsMessages";
function MessageItem({ onReact, user_Reactions, msg, msgId, onGoToDM, user, time, editId, editText, onEditChange, onSave, onCancelEdit, openMenuId, onToggleMenu, onEdit, onDelete, onClose }) {
  useEffect(() => {
    console.log(user_Reactions, "reactions del mensaje");
  }, [user_Reactions])
  const { channelid } = useParams();

  function onReact(reactionId, emoji) {/*
    console.log(msgId, "ID del mensaje al que se reacciona");

    fetch(`${import.meta.env.VITE_API_URL}/private/react_message`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reactionId, msgId, emoji })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log("Reaction added/updated successfully");
          if (!message.trim()) return;

          

        } else {
          console.error("Error adding/updating reaction:", data.error);
        }
      })
      .catch(error => {
        console.error("Error adding/updating reaction:", error);
      });

*/

    socket.emit("send_emoji_message_room", {
      msgId,
      emoji,
      channelid 

    });


  }


  return (
    <div className={styles.Container_Messageid}>
      <div className={styles.message_container_details} onClick={onGoToDM}>
        <img
          src={user?.img}
          alt="avatar"
          className={styles.message_avatar}


        />

        <div className={styles.message_div}>
          <p className={styles.message_name}>{user?.name} {user?.last_name} <small>{time}</small></p>

          <div className={styles.messageText}>
            {editId === msgId ? (
              <textarea
                autoFocus
                type="text"
                value={editText}
                onChange={onEditChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // evita salto de línea
                    onSave();
                  }
                  if (e.key === "Escape") onCancelEdit();
                }}
              >
              </textarea>
            ) : (
              msg.message
            )}
            <div className={styles.Container_Reactions_Message}>
              {user_Reactions?.map((reaction) => (


                <span key={reaction.reactionid} >
                  {reaction.emoji}

                  {reaction.count > 1 && <span>{reaction.count}</span>}

                </span>
              ))}






            </div>
          </div>

          {editId === msgId && (
            <div className={styles.editActions}>
              <p>Press <span>Enter  </span> to save and <span>Escape</span> to cancel </p>
            </div>
          )}
        </div>

        <button className={styles.btn_ellipsis} onClick={onToggleMenu}>
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      {openMenuId === msgId && (
        <OptionsMessages
          dataUserId={user?.userid}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
          onReact={onReact}
          msgId={msgId}
        />
      )}
    </div>
  );
}

export default MessageItem;