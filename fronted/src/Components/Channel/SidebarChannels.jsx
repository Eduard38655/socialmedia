import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroupContext } from "../../Context/GroupDetailsContext.jsx";
import styles from "../../Styles/ChannelNav.module.css";
import { useChannels } from "../../hook/useChannel.jsx";

function Sidebar() {
  const navigate = useNavigate();
  const { Group_Name, setGroup_Name } = useContext(GroupContext);
  const { groupid, channelid } = useParams();

  // Hook de canales
  const { sections, openSections, setOpenSections } = useChannels(
    groupid,
    setGroup_Name
  );

  function changeChannel(channelId, channelName) {
    navigate(`/dashboard/channel/${groupid}/${channelId}`);

    setGroup_Name((prev) => ({
      ...prev,
      channel: channelName,
    }));
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

          {/* TITLE */}
          <div className={styles.Header}>
            <span >Channels</span>

            <button type="button">
              +
            </button>
          </div>

          {/* SECTIONS */}
          <nav>
            <ul>
              {sections.map((section) => {
                const isOpen = openSections[section.sectionid];

                return (
                  <li key={section.sectionid} className={styles.Section_Item}>

                    {/* SECTION HEADER */}
                    <div
                      className={styles.Section_List}
                      onClick={() =>
                        setOpenSections((prev) => ({
                          ...prev,
                          [section.sectionid]: !prev[section.sectionid],
                        }))
                      }
                    >
                      <span>-----[{section.name}]-----</span>

                      <i
                        className={`fa-solid fa-chevron-${isOpen ? "down" : "right"
                          }`}

                      />
                    </div>

                    {/* CHANNELS */}
                    {isOpen && (
                      <ul  >
                        {(section.channels || []).map((ch) => {
                          const isActive =
                            Number(channelid) === Number(ch.channelid);

                          return (
                            <li
                              role="button" tabIndex={0}
                              key={ch.channelid}
                              onClick={() =>
                                changeChannel(ch.channelid, ch.name)
                              }
                              className={`${styles.Channel_List} ${isActive ? styles.active : ""
                                }`}
                            >
                              <span  >
                                <i
                                  className={`fa-solid fa-${ch.is_private ? "lock" : "hashtag"
                                    }`}
                                />
                                <span>| {ch.name}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;