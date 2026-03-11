import Channels_members from "../Components/Channel/ChannelList.jsx"
import MessageList from "../Components/Chat/MessageList.jsx"
import Screen from "../Components/Content/Screen.jsx"
import Workspace_members from "../Components/workspace/workspace_members.jsx"
import Styles from "../Styles/DashBoardPage.module.css"
function DashBoardPage(params) {

    return (<>
        <div className={Styles.container}>
            <Workspace_members />
            <Channels_members />
            <MessageList />
        </div>
        <div className={Styles.screen}>
            <Screen />
        </div>


    </>)
}

export default DashBoardPage
