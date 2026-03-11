import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true
});

function Screen() {

  const { senderid } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ENTRAR AL CHAT
  useEffect(() => {
console.log(senderid,"sssenderid");

    socket.emit("join_chat", senderid);

  }, [senderid]);

  // RECIBIR MENSAJES
  useEffect(() => {

    const handleReceive = (data) => {

      setMessages(prev => [...prev, data]);
console.log(data);

    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };

  }, []);

  // ENVIAR MENSAJE
  function SendMessage() {

    if (!message) return;

    socket.emit("send_message", {
      message: message,
      receiverId: senderid
    });

    setMessage("");

  }

  return (
    <>

      {messages.map((msg, index) => (
        <div key={index}>
          <p>{msg.message}</p>
        </div>
      ))}

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={SendMessage}>
        Send
      </button>

    </>
  );
}

export default Screen;