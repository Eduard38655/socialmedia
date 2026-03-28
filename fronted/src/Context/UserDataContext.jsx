import { createContext, useEffect, useState } from "react";


export const UserDataContext = createContext();

export function UserDataProvider({ children }) {

    const [Profile, setProfileData] = useState({});
  useEffect(() => {

        async function GetUserDetails() {

            try {

                const response = await fetch(`${import.meta.env.VITE_API_URL}/public/me`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();
 

                setProfileData([data ]);

            } catch (error) {
                console.error(error);
            }

        }

        GetUserDetails();

    }, []);

    return (<>
        <UserDataContext.Provider value={{ Profile, setProfileData }}>
            {children}
        </UserDataContext.Provider>
    </>)
}

export default UserDataProvider