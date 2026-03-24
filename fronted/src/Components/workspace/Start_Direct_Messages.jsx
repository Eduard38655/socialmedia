import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../Styles/ChannelNav.module.css";
import StartNewChat from "../Chat/StartNewChat";

function Sidebar() {
  const navigate = useNavigate();
  const { groupid } = useParams();

  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showDirectMessage, setShowDirectMessage] = useState(false);
  const [Actions, setActions] = useState("");

  useEffect(() => {
    // Channels
    fetch(`http://localhost:3000/private/channel_members/${groupid}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setChannels(data?.data || []);
      })
      .catch(console.error);

    // Direct messages
    fetch("http://localhost:3000/private/Direct_Messages", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.profileData || null);
        setMessages(data?.data || []);
      })
      .catch(console.error);
  }, [groupid]);

  function handleViewMessages(userId) {
    navigate(`/dashboard/@me/message/${userId}`);
  }

  function DeleteMessage(userId) {
    fetch(`http://localhost:3000/private/Delete_Direct_Messages/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        // 🔥 eliminar del estado sin recargar
        setMessages((prev) =>
          prev.filter((u) => u?.userid !== userId)
        );

        navigate("/dashboard/@me");
      })
      .catch(console.error);
  }

  return (
    <>
      <aside className={styles.container_Channel}>
        <div className={styles.Header_container}>
          <div className={styles.Header}>
            <label>Direct Messages</label>

            <button
              type="button"
              onClick={() => {
                setShowDirectMessage(true);
                setActions("AddChat");
              }}
            >
              +
            </button>
          </div>

          <nav>
            <ul className={styles.userList}>
              {(messages || [])
                .filter(Boolean)  
                .map((user, index) => (
                  <li key={`user-${user?.userid}-${index}`} className={styles.userInfo}>
                    
                    <button
                      type="button"
                      className={styles.userItem}
                      onClick={() => handleViewMessages(user?.userid)}
                    >
                      <div className={styles.avatarContainer}>
                        
                
                        <img
                          className={styles.avatar}
                          src={user?.img || "/default-avatar.png"}
                          alt={`${user?.name || ""} ${user?.last_name || ""}`}
                        />

                        <span
                          className={`${styles.status} ${
                            user?.status === "ONLINE"
                              ? styles.online
                              : user?.status === "OFFLINE"
                              ? styles.offline
                              : user?.status === "BUSY"
                              ? styles.busy
                              : ""
                          }`}
                        />
                      </div>

                      <p
                        className={styles.userLine}
                        title={`${user?.name || ""} ${user?.last_name || ""}`}
                      >
                        {user?.name} {user?.last_name}
                      </p>
                    </button>

                
                    <button
                      className={styles.DeleteMessage_btn}
                      onClick={() => DeleteMessage(user?.userid)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </aside>

      {showDirectMessage && (
        <StartNewChat
          Actions={Actions}
        
          showDirectMessage={showDirectMessage}
          setShowDirectMessage={setShowDirectMessage}
          onViewMessages={handleViewMessages}
        />
      )}
    </>
  );
}

export default Sidebar;