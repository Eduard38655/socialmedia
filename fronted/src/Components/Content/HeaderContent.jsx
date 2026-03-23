import { useContext } from "react";
import { GroupContext } from "../../Context/GroupDetailsContext.jsx";
import { UserSidebarContext } from "../../Context/UserSidebarContext.jsx";
import styles from "../../Styles/ChatScreen.module.css";
function HeaderContent(params) {
    const { Group_Name, setGroup_Name } = useContext(GroupContext)
    const {ShowSidebar, setShowSidebar} = useContext(UserSidebarContext)
    return (<>

        <header className={styles.header_container_Screen}>
            <nav>
                <div>
                    <span># {" "}{Group_Name.channel }</span>
                    <span>|</span>
                    <span><i className="fa-solid fa-users"></i>{" "}{Group_Name.members || "#"}</span>
                </div>

                <ul>

                    <li><i className="fa-solid fa-magnifying-glass"></i></li>
                    <li><i className="fa-solid fa-phone"></i></li>
                    <li> <i className="fa-solid fa-video"></i></li>
                    <li onClick={()=>{setShowSidebar((prev)=>!prev)}}><i className="fa-solid fa-users"></i></li>
                  
                    <li><i className="fa-solid fa-ellipsis-vertical"></i></li>

                </ul>
            </nav>
        </header>
    </>)
}

export default HeaderContent