import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Chat = () => {
  const { conversationId } = useParams();
  const Access = getCookie("Access-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get conversation ID from location state or params
  const stateNewsId = location.state?.newsItem?.id;
  const effectiveConversationId = stateNewsId || conversationId;

  useEffect(() => {
    // Optional: Fetch previous messages if conversation exists
    if (effectiveConversationId) {
      fetchConversationHistory(effectiveConversationId);
    }
  }, [effectiveConversationId]);

  const fetchConversationHistory = async (conversationId) => {
    try {
      const response = await fetch(`/ai/api/conversation/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": Access
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error("Error fetching conversation history:", error);
    }
  };

  const handleSendMessage = async (event) => {
    if ((event.type === "click" || event.key === "Enter") && newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsLoading(true);
      
      try {
        const botResponse = await fetchBotResponse(newMessage);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse.answer, isUser: false }]);
      } catch (error) {
        console.error("Error getting response:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "Please check your connection!", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchBotResponse = async (userInput) => {
    const response = await fetch("/ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": Access
      },
      credentials: "include",
      body: JSON.stringify({
        question: userInput,
        conversation_id: effectiveConversationId
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbee]">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for navbar height */}
        {/* Sidebar */}
        <Sidebar />
        
        {/* Chat area - adjusted to work with sidebar */}
        <div className="flex-1 ml-16 transition-all duration-300 p-4 flex flex-col">
          {/* Chat messages container */}
          <div className="flex-1 overflow-y-auto mb-4 max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-3 pb-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 my-8">
                  <p>Start a conversation with the Journalist</p>
                </div>
              )}
              
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
          </div>
          
          {/* Message input area */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex gap-2 items-center border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)] p-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
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
    </div>
  );
};

export default Chat;