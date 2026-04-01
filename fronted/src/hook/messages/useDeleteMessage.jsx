// hooks/messages/useDeleteMessage.js

function useDeleteMessage(setMessages) {
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/private/Delete_Direct_Messages/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (data.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return handleDelete; // ← retorna la función, no el resultado
}

export default useDeleteMessage;