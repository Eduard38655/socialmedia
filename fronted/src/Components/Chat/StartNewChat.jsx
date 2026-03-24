import { useEffect, useState } from "react";
import { useStartChats } from "../../hook/useStartChat";
import styles from "../../Styles/ChannelNav.module.css";

function StartNewChat({ setShowDirectMessage }) {
  const startMessages = useStartChats(setShowDirectMessage);

  const [users, setUsers] = useState([]);
  const [backupUsers, setBackupUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getUsers() {
      const res = await fetch("http://localhost:3000/private/Global_users", {
        credentials: "include",
      });

      const data = await res.json();
      setUsers(data.data);
      setBackupUsers(data.data);
    }

    getUsers();
  }, []);

  // ✅ filtro corregido
  useEffect(() => {
    if (!search) {
      setUsers(backupUsers);
      return;
    }

    const filtered = backupUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );

    setUsers(filtered);
  }, [search, backupUsers]);

  return (
    <div className={styles.container_NewChannel_DirectMessage}>
      <aside>
        <header>
          <p>Nuevo Mensaje</p>
          <button onClick={() => setShowDirectMessage(false)}>X</button>

          <input
            placeholder="Buscar..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </header>

        <div>
          {users.map((user) => (
            <div
              key={user.userid}
              onClick={() => startMessages(user.userid)}
            >
              <img src={user.img} />
              <p>{user.name} {user.last_name}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default StartNewChat;