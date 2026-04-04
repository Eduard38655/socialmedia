import styles from "../../Styles/ChatScreen.module.css";
import OptionsMessages from "../Chat/OptionsMessages";
function MessageItem({ msg, msgId, onGoToDM, user, time, editId, editText, onEditChange, onSave, onCancelEdit, openMenuId, onToggleMenu, onEdit, onDelete, onClose }) {
  return (
    <div className={styles.Container_Messageid}>
      <div className={styles.message_container_details} onClick={ onGoToDM}>
        <img
          src={user?.img  }
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
        />
      )}
    </div>
  );
}

export default MessageItem;