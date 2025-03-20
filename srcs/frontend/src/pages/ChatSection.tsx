import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import Sidebar from "../components/Sidebar";

const ChatSection = () => {
  const Access = getCookie("Access-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const newsItem = location.state?.newsItem || "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  console.log("Item : ", newsItem);
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsLoading(true);
      try {
        const botResponse = await fetchBotResponse(newMessage);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse.answer, isUser: false }]);
      } catch (error) {
        console.error("Chat Error:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "An error occurred.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchBotResponse = async (userInput: string) => {
    const response = await fetch("/ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": Access,
      },
      credentials: "include",
      body: JSON.stringify({ question: userInput, conversation_id: newsItem.id }),
    });
    return response.json();
  };

  return (
    <div className="flex h-4xl bg-[#fdfbee]">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 items-center relative">
        <button
          className="absolute top-4 right-4 bg-gray-200 px-4 py-2 border border-black shadow-md"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        {/* Conversation Header */}
        <div className="w-[%80] text-center py-4 border-b border-black bg-[#F5E6CF] shadow-md">
          <h2 className="text-xl font-semibold">{newsItem.content || "Conversation"}</h2>
        </div>
        
        <div className="flex flex-col flex-grow w-full p-4 overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 my-1 border border-black shadow-md rounded-lg ${
                message.isUser ? "bg-[#F5E6CF] self-end" : "bg-gray-200 self-start"
              }`}
            >
              <p className={message.isUser ? "text-right" : "text-left"}>
                {message.isUser ? "" : "Journalist: "} {message.text}
              </p>
            </div>
          ))}
          {isLoading && <p className="text-gray-500 italic">Journalist is typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        <div className="w-full max-w-2xl flex gap-3 p-4 border-t border-black">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-black rounded-md shadow-md"
          />
          <button
            className="px-5 py-2 border border-black shadow-md bg-gray-200"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
