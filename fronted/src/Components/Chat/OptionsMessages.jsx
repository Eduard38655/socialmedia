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
                <span>Update</span> <i className="fa-solid fa-pen-to-square"></i>
              </li>


              <li onClick={onClose}>
                <span>Talk</span>
                <i className="fa-regular fa-user"></i>
              </li>
              {/*hacer que me valide el id buscar las optiones y decirme si si e usuraio puede boarara onon */}

              <li onClick={onDelete} className={styles.deleteOption}>
                <span>Delete</span>
                <i className="fa-solid fa-trash"></i>
              </li>
            </>
          )}



        </ul>
      </div>
    </div>
  );
}

export default OptionsMessages;