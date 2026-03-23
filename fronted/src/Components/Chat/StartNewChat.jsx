import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/ChannelNav.module.css";
import { socket } from "../../utils/socket";

function StartNewChat({ ShowDirectMessage, setShowDirectMessage, Actions, setActions }) {

    const [GeAllUsers, SetGeAllUsers] = useState([])
    const navigate = useNavigate()
    const [Search, SetSearch] = useState("")
    const [BackupSearch, SetBackupSearch] = useState([])
    useEffect(() => {
        if (!Search) {
            SetGeAllUsers(BackupSearch)
            return
        }

        const FilterName = GeAllUsers.filter((user) => {
            return user.name.toLowerCase().includes(Search.toLowerCase())
        })

        SetGeAllUsers(FilterName)
    }, [Search])


    useEffect(() => {
        const GetUsers = async () => {

            const response = await fetch("http://localhost:3000/private/Global_users", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json()

            SetGeAllUsers(data.data)
            SetBackupSearch(data.data)
        }
        GetUsers()


    }, [ShowDirectMessage])
    
    useEffect(() => {
        const handleReceive = (data) => {

            console.log(data)

            if (data.ok) {
                SetMessages(data.data)
            }

        };

        socket.on("MessagesResult", handleReceive);

        return () => {
            socket.off("MessagesResult", handleReceive);
        };

    }, []);
    function SendMessage() {

        if (!message) return;

        const newMessage = {
            message: message
        };

        setMessages(prev => [...prev, newMessage]);

        socket.emit("send_message", {
            message: message,
            receiverId: senderid
        });

        setMessage("");
    }



    function ViewMessages(userId) {

        navigate(`/dashboard/message/${userId}`)

        socket.emit("send_message", {
            message: "",
            receiverId: senderid
        });

    }
    return (<>
        <div className={styles.container_NewChannel_DirectMessage}>

            <aside>
                <header>
                    <div className={styles.Header_btn1}>
                        <div>
                            <p>{Actions == "AddChat" ? "Nuevo Mensaje Directo" : "Crear un nuevo canal"}    </p>
                            <span>{Actions == "AddChat" ? "Busca a alguien para iniciar una conversación privada." : "Organiza las conversaciones de tu equipo por temas."}</span>
                        </div>
                        <button onClick={() => { setShowDirectMessage(false) }}><i className="fa-solid fa-xmark"></i></button>
                    </div>

                    {Actions == "AddChat" ? (<>
                        <div className={styles.Div_Input}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Buscar..." onChange={(e) => { SetSearch(e.target.value) }} />
                        </div>
                    </>) : (<>


                        <input type="text" placeholder="# ej. Programacion" className={styles.Input_NewChannel} />



                    </>)}

                </header>


                {Actions == "AddChat" ? (<>
                    <div className={styles.GeAllUsers_container}>
                        {GeAllUsers && GeAllUsers.length > 0 ? (<>

                            {GeAllUsers.map((user, index) => (
                                <>
                                    <>
                                        <div key={index} onClick={() => { ViewMessages(user.userid) }} className={styles.User_div}>
                                            <img src={user.img} alt="" />
                                            <p>{user.name} {" "} {user.last_name}</p>

                                        </div>
                                    </>
                                </>
                            )
                            )}
                        </>) : (<>


                        </>)

                        }
                    </div>

                </>) : (<>
                    <div className={styles.createChannelBox}>

                        <div className={styles.privateOption}>
                            <div>
                                <p>Hacer privado</p>
                                <span>Solo las personas invitadas pueden ver este canal.</span>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.cancel} onClick={() => { setShowDirectMessage(false) }}>Cancelar</button>
                            <button className={styles.save}>Crear Canal</button>
                        </div>

                    </div>



                </>)}



            </aside>
        </div>
    </>)
}




export default StartNewChat