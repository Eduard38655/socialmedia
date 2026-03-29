import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../Styles/DirecMessage.module.css";
import StartNewChat from "../Chat/StartNewChat";

function Sidebar() {
  const navigate = useNavigate();
  const { groupid } = useParams();

  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showDirectMessage, setShowDirectMessage] = useState(false);
  const [actions, setActions] = useState("");

  useEffect(() => {
     if (!groupid) {
            console.log("groupid undefined, skip fetch"); // confirma el problema
            return;
        }
    fetch(`${import.meta.env.VITE_API_URL}/private/channel_members/${groupid}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setChannels(data?.data || []);
      })
      .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL}/private/Direct_Messages`, {
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

  function deleteMessage(userId) {
    fetch(`${import.meta.env.VITE_API_URL}/private/Delete_Direct_Messages/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        setMessages((prev) => prev.filter((u) => u?.userid !== userId));
        navigate("/dashboard/@me");
      })
      .catch(console.error);
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBody}>
          <div className={styles.sidebarHeader}>
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
            <ul className={styles.conversationList}>
              {(messages || []).filter(Boolean).map((user, index) => (
                <li
                  key={`user-${user?.userid}-${index}`}
                  className={styles.conversationItem}
                >
                  <button
                    type="button"
                    className={styles.conversationButton}
                    onClick={() => handleViewMessages(user?.userid)}
                  >
                    <div className={styles.avatarWrapper}>
                      <img
                        className={styles.avatarImage}
                        src={user?.img || "/default-avatar.png"}
                        alt={`${user?.name || ""} ${user?.last_name || ""}`}
                      />

                      <span
                        className={`${styles.statusDot} ${
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
                      className={styles.userName}
                      title={`${user?.name || ""} ${user?.last_name || ""}`}
                    >
                      {user?.name} {user?.last_name}
                    </p>
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => deleteMessage(user?.userid)}
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
          Actions={actions}
          showDirectMessage={showDirectMessage}
          setShowDirectMessage={setShowDirectMessage}
          onViewMessages={handleViewMessages}
        />
      )}
    </>
  );
}

export default Sidebar;