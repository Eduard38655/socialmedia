
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupContext } from "../../Context/GroupDetailsContext.jsx";
import { UserDataContext } from "../../Context/UserDataContext.jsx";
import SettingPage from "../../Pages/SettingPage.jsx";
import styles from "../../Styles/GroupNavBar.module.css";
import AddWorkSpaces from "./AddWorkSpace";

function WorkspaceMembers(params) {
    const navigate = useNavigate()
    const { Group_Name, setGroup_Name } = useContext(GroupContext)
    const [NewWorkSpace, SetNewWorkSpace] = useState(false)
    const [workspace_members, setworkspace_members] = useState([])
    const { Profile } = useContext(UserDataContext)
  

    useEffect(() => {
        const GetDataUser = async () => {
            try {
                const response = await fetch("http://localhost:3000/private/workspace_members", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",

                    },

                });
                const data = await response.json();
                console.log(data, "worksapces");


                setworkspace_members(data.data)
            } catch (error) {
                console.error(error);
            }


        }
        GetDataUser()

    }, [])
    function ViewGroupInfo(channelId, ChannelName,Members) {
        setGroup_Name({ group: ChannelName, channel: "", members: Members })
        navigate(`/dashboard/channel/${channelId}`)
    }

  const [ShowSetting,SetShowSettingPage] = useState(false)
    return (<>

        <aside className={styles.sidebar_Channel_Group}>

                <button title="Direct messages" className={styles.Logo_Discord} onClick={() => { navigate("/dashboard/@me") }}><i className="fa-brands fa-discord"></i></button>
            <nav className={styles.navbarGroup}>

                <ul>
                    {workspace_members && workspace_members.length > 0 ? (<>
                        {workspace_members.map((work, index) => (



                            <li key={index} onClick={() => { ViewGroupInfo(work.workspaces.workspaceid, work.workspaces.name, work.workspaces.name.length) }}>
                                {work.workspaces.img ? (<>
                                    <img src={work.workspaces.img} alt="" />
                                    <span>{(work.workspaces.name).split(" ")
                                        .map(word => word[0])
                                        .join("")
                                        .toUpperCase()}</span>
                                </>) : (<>

                                    <span>{(work.workspaces.name).split(" ")
                                        .map(word => word[0])
                                        .join("")
                                        .toUpperCase()}</span>
                                </>)}

                            </li>

                        ))}
                    </>) : (<>

                    </>)}
                </ul>

            </nav>
            <div className={styles.Profiles_Section_container}>
                <button onClick={(e) => { SetNewWorkSpace(true) }}><i className="fa-solid fa-circle-plus"></i></button>

                {Profile && Profile.length > 0 ? (<>
                    {Profile.map((User, index) => (
                        <div key={index} onClick={() =>SetShowSettingPage(true)}>
                            <img src={User.img} alt="" />
                        </div>
                    ))}


                </>) : (<></>)}



            </div>
        </aside>
        {NewWorkSpace == true ?
            <AddWorkSpaces SetNewWorkSpace={SetNewWorkSpace} NewWorkSpace={NewWorkSpace} />
            : <></>}

         

        {ShowSetting ==true ? (<>
        
        <SettingPage setShowProfile={SetShowSettingPage}/>
        </>) : <></>}
 
    </>
    )
}

export default WorkspaceMembers
