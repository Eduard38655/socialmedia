import { createContext, useEffect, useState } from "react";


export const UserDataContext = createContext();

export function UserDataProvider({ children }) {

    const [Profile, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        async function GetUserDetails() {
            try {
                console.log(import.meta.env.VITE_API_URL);


                const response = await fetch(`${import.meta.env.VITE_API_URL}/private/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );



                const data = await response.json();
                console.log(data,"daha");
                
                if (data?.ok && data?.user) {
                    setProfileData(data.user);
                    setError(null);
                } else {
                    setProfileData(null);
                    setError(data?.message || "Failed to load user data");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setProfileData(null);
                setError(err.message);
            }
        }

        GetUserDetails();

    }, []);

    return (<>
        <UserDataContext.Provider value={{ Profile, setProfileData, isLoading, error, setIsLoading }}>
            {children}
        </UserDataContext.Provider>
    </>)
}

export default UserDataProvider