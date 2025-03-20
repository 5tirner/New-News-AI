import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import Sidebar from "../components/Sidebar";



const ChatSection = () => {
  const Access = getCookie("Access-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for bot response
  const newsItem = location.state?.newsItem || "";


  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsLoading(true); 
      try {
        const botResponse = await fetchBotResponse(newMessage);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse.answer, isUser: false }]);
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, { text: "please check your connection!", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // API
  const fetchBotResponse = async (userInput: string) => {
    const response = await fetch("/ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": Access
      },
      credentials: "include",
      body: JSON.stringify({ 
        question: userInput,
        conversation_id: newsItem.id
      }),
    });
    const data = await response.json();
    return data;
  };

  return (
    <>
    <div className="p-5 min-h-screen">
      <div className="w-[100%] text-right">
        <button className="bg-gray-200  w-[5%]  text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" onClick={() => navigate(-1)} >Back</button>
      </div>
      <div className=" md:h-64 lg:h-96 w-full flex flex-col items-center justify-end gap-5 ">

        <div className="w-[84%] flex flex-col gap-2 items-center justify-center overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-[100%] p-2 border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)]  ${message.isUser ? "bg-[#F5E6CF] self-end" : "bg-gray-200 self-start"
                }`}
            >
              <p className={message.isUser ? "text-right" : "text-left"}>
                {message.isUser ? "" : "Journalist: "} {message.text}
              </p>
            </div>
          ))}
          {isLoading && <p className="text-gray-500 italic"> Journalist is typing...</p>}
        </div>
        <div className="w-full h-[10%] flex gap-5 items-center justify-center">
          <input
            type="text"
            value={newMessage}
            onKeyDown={handleSendMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-[70%] p-2 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] "
          />
          <button
            className="border border-black size-fit w-[5%] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            onClick={handleSendMessage}
            disabled={isLoading} // Disable button when bot is responding
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>

    </div>
    </>
  );
};

export default ChatSection;