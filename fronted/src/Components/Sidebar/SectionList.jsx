import styles from "../../Styles/ChannelNav.module.css";
import ChannelItem from "./ChannelItem.jsx";

function SectionList({ sections, openSections, setOpenSections, activeChannelId, onChannelClick }) {
  return (
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
                <i className={`fa-solid fa-chevron-${isOpen ? "down" : "right"}`} />
              </div>

              {/* CHANNELS */}
              {isOpen && (
                <ul>
                  {(section.channels || []).map((ch) => (
                    <ChannelItem
                      key={ch.channelid}
                      channel={ch}
                      isActive={Number(activeChannelId) === Number(ch.channelid)}
                      onClick={() => onChannelClick(ch.channelid, ch.name)}
                    />
                  ))}
                </ul>
              )}

            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SectionList;