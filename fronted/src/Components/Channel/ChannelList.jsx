
import { useEffect, useState } from "react";
function WorkspaceMembers(params) {
    const [GetChannelID, SetGetChannelID] = useState("")
    const [Channel_members, setChannel_members] = useState([])
    const [ShowNewChannel, SetShowNewChannel] = useState(false)
    useEffect(() => {
        const GetDataChannels = async () => {
            try {
                const response = await fetch("http://localhost:3000/private/channel_members", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",

                    },

                });
                const data = await response.json();
                console.log(data);

                setChannel_members(data.data)
            } catch (error) {
                console.error(error);
            }


        }
        GetDataChannels()

    }, [])

    return (<>
        <div>
            <div>
                <label htmlFor="">Chanel</label>
                <button onClick={() => {SetShowNewChannel(true) }}>+</button>
            </div>
            {Channel_members && Channel_members.length > 0 ? (<>
                {Channel_members.map((channel, index) => (
                    <div key={index} onClick={() => { SetGetChannelID(channel.channels.channelid) }}>

                        <span>{channel.channels.is_private ? <i className="fa-solid fa-lock-open"></i> : <i className="fa-solid fa-lock"></i>}{channel.channels.name}</span>

                    </div>
                ))}
            </>) : (<></>)}


        </div>





        {ShowNewChannel ? (<>
            <div>
               <div>
                 <p>  Crear un nuevo canal
                    <br />
                    <span>Los canales son donde tu equipo se comunica. Son mejores cuando se organizan en torno a un tema.</span></p>

<button onClick={() => {SetShowNewChannel(false) }} ><i className="fa-solid fa-xmark"></i></button>
               </div>
                <div>
                    <label htmlFor="">Nombre del canal</label>
                    <input type="text" placeholder="# ej. Software" />
                </div>


                <div>

                    <div>
                        <h4>Hacer privado</h4>
                        <p>Solo las personas invitadas pueden ver este canal.</p>
                    </div>

                    <input type="checkbox" />
                </div>

                <div>
                    <button onClick={() => {SetShowNewChannel(false) }}  >Cancelar</button>
                    <button>Crear Canal</button>
                </div>

            </div>

        </>) : (<>


        </>)}

    </>)
}

export default WorkspaceMembers
