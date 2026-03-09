
import { useEffect, useState } from "react";
import AddWorkSpaces from "./AddWorkSpace";
function WorkspaceMembers(params) {
    const [NewWorkSpace, SetNewWorkSpace] = useState(false)
    const [workspace_members, setworkspace_members] = useState([])
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
                setworkspace_members(data.data)
            } catch (error) {
                console.error(error);
            }


        }
        GetDataUser()

    }, [])

    return (<>
        <nav>

            {workspace_members && workspace_members.length > 0 ? (<>
                {workspace_members.map((work, index) => (



                    <div key={index}>
                        {work.workspaces.img ? (<>
                            <img src={work.workspaces.img} alt="" />

                        </>) : (<>

                            <span>{(work.workspaces.name).split(" ")
                                .map(word => word[0])
                                .join("")
                                .toUpperCase()}</span>
                        </>)}

                    </div>

                ))}
            </>) : (<>
                There is not data
            </>)}
            <button onClick={(e) => { SetNewWorkSpace(true) }}><i className="fa-solid fa-circle-plus"></i></button>
        </nav>

        {NewWorkSpace == true ?
            <AddWorkSpaces SetNewWorkSpace={SetNewWorkSpace} NewWorkSpace={NewWorkSpace} />
            : <></>}
    </>)
}

export default WorkspaceMembers
