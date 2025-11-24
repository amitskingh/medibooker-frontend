import { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendChatMessage } from "@/api/chatApi";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", message: "Hello! How can I assist you today?" },
  ]);

  // Generate sessionId if not exists
  useEffect(() => {
    let sid = localStorage.getItem("chat_session_id");
    if (!sid) {
      sid = "session-" + Math.random().toString(36).substring(2);
      localStorage.setItem("chat_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", message: userMsg }]);
    setInput("");

    // Send to backend
    const botReply = await sendChatMessage(sessionId, userMsg);

    console.log(botReply);

    setMessages((prev) => [...prev, { sender: "bot", message: botReply }]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700"
      >
        💬
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 rounded-xl shadow-xl border bg-white flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-medium">MediBooker Chatbot</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((m, i) => (
              <ChatMessage key={i} sender={m.sender} message={m.message} />
            ))}
          </div>

          {/* Input */}
          <ChatInput value={input} onChange={setInput} onSubmit={handleSend} />
        </div>
      )}
    </>
  );
}
