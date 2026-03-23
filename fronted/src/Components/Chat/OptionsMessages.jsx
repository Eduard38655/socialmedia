import { useContext } from "react";
import { UserDataContext } from "../../Context/UserDataContext.jsx";
import styles from "../../Styles/ChatScreen.module.css";

function OptionsMessages({ onEdit, onDelete, onClose, dataUserId }) {

  const { Profile } = useContext(UserDataContext);

  const isMine = Profile[0].userid === dataUserId;
 
    
 
  return (
    <div className={styles.Container_Opt}>
      <div className={styles.messageText_opt}>
        <ul>

          {isMine && (
            <>
              <li onClick={onEdit}>
                <i className="fa-solid fa-pen-to-square"></i> Update
              </li>

              <li onClick={onDelete}>
                <i className="fa-solid fa-trash"></i> Delete
              </li>
            </>
          )}

          <li onClick={onClose}>
            <i className="fa-regular fa-user"></i> Talk
          </li>

        </ul>
      </div>
    </div>
  );
}

export default OptionsMessages;