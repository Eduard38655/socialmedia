import { useEffect } from "react";


function Reactions(params) {

    useEffect(() => {

        const GetAllReactions = async(params) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/private/reactions`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }

                }
            ) 
            const data = await res.json();
            if (data.ok) {
                 console.log(data,"reactions");
                 return
            }
            
        }
        GetAllReactions()
    }, [])
    return (
        <div className="reactions">

        </div>
    )
}

export default Reactions