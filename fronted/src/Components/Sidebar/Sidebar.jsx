import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroupContext } from "../../Context/GroupDetailsContext.jsx";
import styles from "../../Styles/SideBar.module.css";
import { useChannels } from "../../hook/useChannel.jsx";
import SectionList from "./SectionList.jsx";

function Sidebar() {
  const navigate = useNavigate();
  const { Group_Name, setGroup_Name } = useContext(GroupContext);
  const { groupid, channelid } = useParams();

  const { sections, openSections, setOpenSections } = useChannels(groupid, setGroup_Name);

  function changeChannel(channelId, channelName) {
    navigate(`/dashboard/channel/${groupid}/${channelId}`);
    setGroup_Name((prev) => ({ ...prev, channel: channelName }));
  }

  return (
    <aside className={styles.container_Channel}>

      {/* HEADER */}
      <div className={styles.Channel_Header_Search}>
        <h3>{Group_Name.group || "#"}</h3>
        <div className={styles.Search_Input}>
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" placeholder="Quick Search" />
        </div>
      </div>

      {/* BODY */}
      <div className={styles.container_Details}>
        <div className={styles.Header_container}>

          <div className={styles.Header}>
            <span>Channels</span>
            <button type="button">+</button>
          </div>

         
          <SectionList
            sections={sections}
            openSections={openSections}
            setOpenSections={setOpenSections}
            activeChannelId={channelid}
            onChannelClick={changeChannel}
          />

        </div>
      </div>
    </aside>
  );
}

export default Sidebar;