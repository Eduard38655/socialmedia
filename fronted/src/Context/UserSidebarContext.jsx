import { createContext, useState } from "react";

/*Get Group Details*/
export const UserSidebarContext = createContext();

export function UserSidebarProvider({ children }) {
    const [ShowSidebar, setShowSidebar] = useState(false);
    return (<>
        <UserSidebarContext.Provider value={{ ShowSidebar, setShowSidebar }}>
            {children}
        </UserSidebarContext.Provider>
    </>)
}

export default UserSidebarProvider