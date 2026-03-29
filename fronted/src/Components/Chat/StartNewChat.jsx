import { useEffect, useMemo, useState } from "react";
import { useStartChats } from "../../hook/useStartChat";
import styles from "../../Styles/DirecMessage.module.css";

function StartNewChat({ setShowDirectMessage }) {
  const startMessages = useStartChats(setShowDirectMessage);

  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function getUsers() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/private/Global_users`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();

        if (isMounted) {
          setAllUsers(data?.data || []);
        }
      } catch (err) {
        console.error("Error loading users:", err);
        if (isMounted) {
          setError("Could not load users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return allUsers;

    return allUsers.filter((user) =>
      `${user?.name || ""} ${user?.last_name || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [search, allUsers]);

  return (
    <div className={styles.newChatOverlay}>
      <aside className={styles.newChatModal}>
        <header className={styles.newChatHeader}>
          <p className={styles.newChatTitle}>Nuevo Mensaje</p>

          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setShowDirectMessage(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search a person..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.usersContainer}>
          {loading && <p className={styles.emptyState}>Loading users...</p>}

          {!loading && error && (
            <p className={styles.emptyState}>{error}</p>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <p className={styles.emptyState}>No users found</p>
          )}

          {!loading &&
            !error &&
            filteredUsers.map((user) => {
              const fullName = `${user?.name || ""} ${user?.last_name || ""}`.trim();

              return (
                <button
                  key={user?.userid}
                  type="button"
                  className={styles.userCard}
                  onClick={() => startMessages(user?.userid)}
                >
                  <img
                    className={styles.userCardAvatar}
                    src={user?.img || "/default-avatar.png"}
                    alt={fullName || "User avatar"}
                  />

                  <div className={styles.userCardInfo}>
                    <p className={styles.userCardName}>{fullName || "Unknown user"}</p>
                  </div>
                </button>
              );
            })}
        </div>
      </aside>
    </div>
  );
}

export default StartNewChat;