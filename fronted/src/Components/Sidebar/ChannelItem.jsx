import styles from "../../Styles/ChannelNav.module.css";

function ChannelItem({ channel, isActive, onClick }) {
    return (
        <li
            role="button"
            tabIndex={0}
            key={channel.channelid}
            onClick={onClick}
            className={`${styles.Channel_List} ${isActive ? styles.active : ""}`}
        >
            <span>
                <i className={`fa-solid fa-${channel.is_private ? "lock" : "hashtag"}`} />
                <span>| {channel.name}</span>
            </span>
        </li>
    );
}

export default ChannelItem;