import { useNavigate } from "react-router-dom";

export function useStartChats(setShowDirectMessage) {
  const navigate = useNavigate();

  const viewMessages = async (receiverid) => {
    try {
      const res = await fetch(
        `http://localhost:3000/private/Start_Message_ByID/${receiverid}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      await res.json();

      // ✅ evitar crash
      if (typeof setShowDirectMessage === "function") {
        setShowDirectMessage(false);
      }

      navigate(`/dashboard/@me/message/${receiverid}`);
    } catch (error) {
      console.error(error);
    }
  };

  return viewMessages;
}