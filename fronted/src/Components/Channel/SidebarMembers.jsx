import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Styles/ChannelNav.module.css";
import { useStartChats } from "../../hook/useStartChat";

const STATUS_STYLES = {
  ONLINE: styles.online,
  OFFLINE: styles.offline,
  BUSY: styles.busy,
};

function SideBarMembers() {
  const startMessages = useStartChats(); // ✅ sin error
  const { groupid } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Get_channel_members/${groupid}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();
        setMembers(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMembers();
  }, [groupid]);

  if (!members.length) return null;

  return (
    <aside className={styles.Aside_Header_container}>
      <ul className={styles.userList}>
 
        {members.map(({ users: user }) => (
          <li key={user.userid} className={styles.user}>
            <button onClick={() => startMessages(user.userid)}>
              <div className={styles.avatarContainer}>
                <img src={user.img} alt={user.name} />
                
                <span
                  className={`${styles.status} ${
                    STATUS_STYLES[user.status] || ""
                  }`}
                />
              </div>
              <p>{user.name} {user.last_name}</p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SideBarMembers;