import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../Styles/ChannelNav.module.css";

const STATUS_STYLES = {
  ONLINE: styles.online,
  OFFLINE: styles.offline,
  BUSY: styles.busy,
};

function SideBarMembers() {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Get_channel_members/${groupid}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setMembers(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMembers();
  }, [groupid]);

  if (!members?.length) return null;

  return (
    <aside className={styles.Aside_Header_container}>
      <div className={styles.userListContainer}>
        <ul className={styles.userList}>
          {members.map(({ users: user }) => (
            <li key={user.userid}>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/@me/message/${user.userid}`)}
              >
                <div className={styles.avatarContainer}>
                  <img
                    src={user.img}
                    alt={`${user.name} ${user.last_name}`}
                  />
                  <span
                    className={`${styles.status} ${STATUS_STYLES[user.status] || ""}`}
                    aria-hidden="true"
                  />
                </div>

                <p title={`${user.name} ${user.last_name}`}>
                  {user.name} {user.last_name}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default SideBarMembers;