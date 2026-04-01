// hooks/messages/useUpdateMessage.js

function useUpdateMessage(setMessages, editText, setEditId, setEditText, url) {
  async function handleUpdate(id) {
    if (!editText.trim()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${url}/${id}`, // ✅ url dinámica
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: editText.trim() }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            (msg.messageid ?? msg.id) === id
              ? { ...msg, message: editText.trim(), updated_at: new Date().toISOString() }
              : msg
          )
        );
        setEditId(null);
        setEditText("");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return handleUpdate;
}

export default useUpdateMessage;