import styles from "../../Styles/ChatScreen.module.css";
import OptionsMessages from "../Chat/OptionsMessages";
function MessageItem({ msg, msgId, user, time, editId, editText, onEditChange, onSave, onCancelEdit, openMenuId, onToggleMenu, onEdit, onDelete, onClose }) {
  return (
    <div className={styles.Container_Messageid}>
      <div className={styles.message_container_details}>
        <img
          src={user?.img || "/default-avatar.png"}
          alt="avatar"
          className={styles.message_avatar}
        />

        <div className={styles.message_div}>
          <p>{user?.name} {user?.last_name} <small>{time}</small></p>

          <div className={styles.messageText}>
            {editId === msgId ? (
              <input
                autoFocus
                type="text"
                value={editText}
                onChange={onEditChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSave();
                  if (e.key === "Escape") onCancelEdit();
                }}
              />
            ) : (
              msg.message
            )}
          </div>

          {editId === msgId && (
            <div className={styles.editActions}>
              <button onClick={onSave}>Guardar</button>
              <button onClick={onCancelEdit}>Cancelar</button>
            </div>
          )}
        </div>

        <button className={styles.btn_ellipsis} onClick={onToggleMenu}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      {openMenuId === msgId && (
        <OptionsMessages
          dataUserId={user?.userid}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
        />
      )}
    </div>
  );
}

export default MessageItem;