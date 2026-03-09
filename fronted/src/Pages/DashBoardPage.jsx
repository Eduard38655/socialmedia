import Channels_members from "../Components/Channel/ChannelList.jsx"
import MessageList from "../Components/Chat/MessageList.jsx"
import Workspace_members from "../Components/workspace/workspace_members.jsx"
function DashBoardPage(params) {

    return (<>
        <Workspace_members />
        <Channels_members />
        <MessageList />
    </>)
}

export default DashBoardPage
