import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
function MessageList(params) {
    const navigate = useNavigate()
    const [GetMessages, SetGetMessages] = useState([])
    const [ShowDirectMessage, SetShowDirectMessage] = useState(false)
    const [Profile, SetProfile] = useState([])
    useEffect(() => {
        const GetDataChannels = async () => {
            try {

                const response = await fetch("http://localhost:3000/private/Direct_Messages", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                console.log(data);

                const users = data.data.map((msg) => {
                    return msg.users_direct_messages_sender_idTousers;
                });



                SetProfile(data.profileData)
                SetGetMessages(users);

            } catch (error) {
                console.error(error);
            }
        };

        GetDataChannels();
    }, []);

    return (<>
        <div>
            <div>
                <h5>Direct Messages</h5>
                <button onClick={() => { SetShowDirectMessage(true) }}>+</button>
            </div>


            {GetMessages && GetMessages.length > 0 ? (<>
                {GetMessages.map((sender, index) => (
                    <div key={index} onClick={()=>{navigate(`/dashboard/:${sender.userid}`)}}>
                        <p>{sender.name}{" "}{sender.last_name}</p>
                        <span>{sender.status == "ONLINE" ? "Online" : "Offline"}</span>
                        <img style={{ width: "80px" }} src={sender.img} alt="" />
                        
                    </div>
                ))}

            </>) : (<></>)}


            <div>
                {Profile && Profile.length > 0 ? (<>
                    {Profile.map((receiver, index) => (
                        <div key={index}>
                            <p>{receiver.name}{""}{receiver.last_name}</p>
                            <span>{receiver.status == "ONLINE" ? "Online" : "Offline"}</span>
                            <img style={{ width: "80px" }} src={receiver.img} alt="" />
                            <button onClick={() => { navigate("/settigs" +receiver.userid) }}><i className="fa-solid fa-gear"></i></button>

                        </div>

                    ))}
                </>) : (<></>)}

            </div>
        </div>

        {ShowDirectMessage && (<div>

            <div>
                <p>Nuevo Mensaje Directo <br /> <span>Busca a alguien para iniciar una conversación privada.</span></p>
                <button onClick={() => { SetShowDirectMessage(false) }}>x</button>

            </div>

            <div>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Buscar..." />

            </div>

            <div>

                shoew data
            </div>
        </div>)}
    </>)
}

export default MessageList