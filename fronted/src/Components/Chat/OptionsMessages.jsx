import { useContext, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext.jsx";
import styles from "../../Styles/ChatScreen.module.css";
import Reactiones from "./Reactions.jsx";
function OptionsMessages({ onEdit, onDelete, onClose, dataUserId, onReact, goToDM }) {
  const [ViewReactions, setViewReactions] = useState(false);
  const { Profile } = useContext(UserDataContext);

  const isMine = Profile[0].userid === dataUserId;



  return (
    <>

      <div className={styles.Container_Opt}>

        <div className={styles.messageText_opt}>
          <ul>


            <>
              {isMine && (<li onClick={onEdit}>
                <span>Update</span> <i className="fa-solid fa-pen-to-square"></i>
              </li>)}

              <li onClick={goToDM}>
                <span>Talk</span>
                <i className="fa-regular fa-user"></i>
              </li>

              <li className={styles.addReaction} onClick={() => { setViewReactions(prev => !prev) }}><span>Agregar Reaction</span><i className="fa-solid fa-chevron-right"></i>
                <ul className={`${styles.Container_reactions} ${ViewReactions ? styles.active : ""}`}>
                  <Reactiones onReact={onReact} />
                </ul>

              </li>
              {isMine ? (<li onClick={onDelete} className={styles.deleteOption}>
                <span>Delete</span>
                <i className="fa-solid fa-trash"></i>
              </li>) : (<>

                <li className={styles.deleteOption}>
                  <span>Report</span>
                  <i className="fa-solid fa-flag"></i>
                </li>
              </>)}



            </>




          </ul>
        </div>
      </div >
    </>
  );
}

export default OptionsMessages;