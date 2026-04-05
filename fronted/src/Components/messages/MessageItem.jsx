import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Styles/ChatScreen.module.css";
import { socket } from "../../utils/socket.js";
import OptionsMessages from "../Chat/OptionsMessages";
function MessageItem({
  user_Reactions, msg, msgId, onGoToDM, user, time,
  editId, editText, onEditChange, onSave, onCancelEdit,
  openMenuId, onToggleMenu, onEdit, onDelete, onClose,goToDM
}) {
  const { channelid } = useParams();
  const isEditing = editId === msgId;

  function handleReact(msgId, emoji) {
    const getMessage = msg.messageid;

    socket.emit("send_emoji_message_room", {
      messageid: getMessage,
      emoji,
      channelid
    });
  }

  // ✅ AQUÍ VA
  const reactions = user_Reactions || [];

  useEffect(() => {
    console.log(user, "sss");

    console.log("RENDER:", msg);
    console.log("REACCIONES:", reactions);
  }, [reactions]);

  return (
    <div className={styles.Container_Messageid}>
      <div className={styles.message_container_details} >
        <img
          src={user?.img ?? "/default-avatar.png"}
          alt={user?.name ?? "User"}
          className={styles.message_avatar}
         
        />

        <div className={styles.message_div}>
          <p className={styles.message_name}>
            {user?.name} {user?.last_name} <small>{time}</small>
          </p>

          <div className={styles.messageText}>
            {isEditing ? (
              <textarea
                autoFocus
                value={editText}
                onChange={onEditChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSave();
                  }
                  if (e.key === "Escape") onCancelEdit();
                }}
              />
            ) : (
              msg.message
            )}

            {/* ✅ REACCIONES */}
            <div className={styles.Container_Reactions_Message}>
              {reactions.map((reaction) => (
                <span key={reaction.reactionid}>
                  {reaction.emoji}
                </span>
              ))}
            </div>
          </div>

          {isEditing && (
            <p className={styles.editActions}>
              Press <span>Enter</span> to save and <span>Escape</span> to cancel
            </p>
          )}
        </div>

        <button
          className={styles.btn_ellipsis}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
        >
          <i className="fa-solid fa-ellipsis" />
        </button>
      </div>

      {openMenuId === msgId && (
        <OptionsMessages
          dataUserId={user?.userid}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
          onReact={handleReact}
          msgId={msgId}
          goToDM={goToDM}
        />
      )}
    </div>
  );
}
export default MessageItem;