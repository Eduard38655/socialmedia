import { useEffect } from "react";


function Reactions(params) {

    useEffect(() => {

        function GetAllReactions(params) {
            const res = fetch(`${import.meta.env.VITE_API_URL}/private/Get_reactions`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }

                }
            ).then(res => res.json())
                .then(data => {
                    console.log(data);
                }
                ).catch(err => {
                    console.error("Error fetching reactions:", err);
                }
                )
        }
        GetAllReactions()
    }, [])
    return (
        <div className="reactions">

        </div>
    )
}