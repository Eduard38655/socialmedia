import { useParams } from "react-router-dom";
import styles from "../../Styles/ChatScreen.module.css";
import { socket } from "../../utils/socket.js";
import OptionsMessages from "../Chat/OptionsMessages";

function MessageItem({
  msg, msgId, onGoToDM, user, time,
  editId, editText, onEditChange, onSave, onCancelEdit,
  openMenuId, onToggleMenu, onEdit, onDelete, onClose,
  user_Reactions,
}) {
  const { channelid } = useParams();
  const isEditing = editId === msgId;

  // ✅ Lógica de reacción local, nombre único
  function handleReact(reactionId, emoji) {
    socket.emit("send_emoji_message_room", { msgId, emoji, channelid });
  }

  // ✅ Este efecto NO debe vivir aquí — muévelo al padre
  // Solo se deja comentado como recordatorio
  // useEffect(() => {
  //   socket.on("receive_emoji_message_room", handler)
  //   return () => socket.off(...)
  // }, [])

  return (
    <div className={styles.Container_Messageid}>
      <div className={styles.message_container_details}>

        {/* ✅ onGoToDM solo en el avatar */}
        <img
          src={user?.img ?? "/default-avatar.png"}
          alt={user?.name ?? "User"}
          className={styles.message_avatar}
          onClick={onGoToDM}
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

            {/* ✅ Reacciones dinámicas */}
            <div className={styles.Container_Reactions_Message}>
              {user_Reactions?.map((reaction) => (
                <span key={reaction.reactionid}>
                  {reaction.emoji}
                  {reaction.count > 1 && <span>{reaction.count}</span>}
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

        {/* ✅ stopPropagation para no disparar onGoToDM */}
        <button
          className={styles.btn_ellipsis}
          onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
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
          onReact={handleReact} // ✅ nombre correcto
          msgId={msgId}
        />
      )}
    </div>
  );
}

export default MessageItem;