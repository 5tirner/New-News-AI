import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";

const ChatSection = () => {
  const { conversationId } = useParams();
  const Access = getCookie("Access-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for bot response
  const idd = location.state?.newsItem || "";

  console.log('this is id : ' + conversationId, idd.id);

  let newsItem;
  if (idd.id) {
    newsItem = idd.id; // Use idd.id if available
  } else {
    newsItem = conversationId; // Fallback to effectiveConversationId
  }

  const handleSendMessage = async (event) => {
    if ((event.type === "click" || event.key === "Enter") && newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsLoading(true);
      try {
        const botResponse = await fetchBotResponse(newMessage);
        console.log(botResponse);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse.answer, isUser: false }]);
      } catch (error) {
        console.error("Chouf Tv:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "Chouf Tv.", isUser: false }]);
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
        conversation_id: newsItem
      }),
    });
    const data = await response.json();
    return data;
  };

  return (
    <>
      <div className="min-h-96 flex flex-col md:flex-row bg-[#fdfbee]">
        <Sidebar />
        <div className="bg-[#fdfbee] w-full flex-1 p-3 sm:p-5 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 fixed">
          <div className="w-full max-w-4xl px-2 text-right">
            <button 
              className="bg-red-600 py-2 px-3 sm:px-4 w-auto border-2 border-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]" 
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          
          <div className="w-full max-w-4xl h-[60vh] md:h-[70vh] flex flex-col items-center justify-end gap-3 sm:gap-5">
            <div className="flex flex-col gap-3 overflow-y-auto w-full h-full pb-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)]
                    ${message.isUser
                      ? "bg-[#F5E6CF] ml-auto"
                      : "bg-gray-200 mr-auto"
                    }`}
                >
                  <p className={message.isUser ? "text-right" : "text-left"}>
                    {message.isUser ? "" : "Journalist: "} {message.text}
                  </p>
                </div>
              ))}
              {isLoading && (
                <p className="text-gray-500 italic text-center">Journalist is typing...</p>
              )}
            </div>
            
            <div className="w-full flex gap-2 items-center border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)] p-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onKeyDown={handleSendMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 focus:outline-none hover:border-transparent"
              />
              <button
                className="border border-black px-2 sm:px-4 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap text-sm sm:text-base"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSection;

