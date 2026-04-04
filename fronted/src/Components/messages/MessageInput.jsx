import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Styles/ChatScreen.module.css";
function MessageInput({ value, onChange, onSend }) {
    const { senderid } = useParams();
    const [message, setMessage] = useState("");
   

    return (<>
        <aside className={styles.Send_Message_container}>
            <div className={styles.Section_Icons}>
                <div className={styles.textarea_container}>
                    <textarea
                        className={styles.textarea}
                        value={value}
                        onChange={onChange}
                    />
                </div>

                <div className={styles.Section_Icons_btn_2}>
                    <div>
                        <button><i className="fa-solid fa-video"></i></button>
                        <button><i className="fa-regular fa-face-smile"></i></button>
                        <button><i className="fa-solid fa-paperclip"></i></button>
                    </div>

                    <div className={styles.btn_send}>
                        <button onClick={onSend}>
                            <i className="fa-solid fa-paper-plane"></i> Send
                        </button>
                    </div>
                </div>
            </div>
        </aside>

    </>)
}

export default MessageInput