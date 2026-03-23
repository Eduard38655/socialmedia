import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/ChannelNav.module.css";
import { socket } from "../../utils/socket";

function AddNewChannel({ ShowDirectMessage, setShowDirectMessage }) {

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
                            <p>Crear un nuevo canal </p>
                            <span>"Organiza las conversaciones de tu equipo por temas.</span>
                        </div>
                        <button onClick={() => { setShowDirectMessage(false) }}><i className="fa-solid fa-xmark"></i></button>
                    </div>


                    <div className={styles.Div_Input}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Buscar..." onChange={(e) => { SetSearch(e.target.value) }} />
                    </div>


                </header>


                 
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

               



            </aside>
        </div>
    </>)
}




export default AddNewChannel