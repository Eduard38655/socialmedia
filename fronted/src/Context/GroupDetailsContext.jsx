import { createContext, useState } from "react";

/*Get Group Details*/
export const GroupContext = createContext();

export function GroupDataProvider({ children }) {

    const [Group_Name, setGroup_Name] = useState({group:"" ,channel:"",members:0});

    return (<>
        <GroupContext.Provider value={{ Group_Name, setGroup_Name }}>
            {children}
        </GroupContext.Provider>
    </>)
}

export default GroupDataProvider