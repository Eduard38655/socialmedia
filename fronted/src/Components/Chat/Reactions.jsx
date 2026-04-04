import { useEffect, useState } from "react";
import styles from "../../Styles/ChatScreen.module.css";
function Reactions({ onReact }) {
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        const GetAllReactions = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/private/reactions`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.ok) setReactions(data.data);
        };
        GetAllReactions();
    }, []);

    return (
        <ul className={styles.Reactions_List}>
            {reactions.map((reaction) => (
                <li key={reaction.reactionid} className={styles.Reaction_Item} onClick={() => onReact(reaction.reactionid,reaction.emoji)}>
                    {reaction.description || ":hashtag"} <span>{reaction.emoji}</span>
                </li>
            ))}
        </ul>
    );
}

export default Reactions;