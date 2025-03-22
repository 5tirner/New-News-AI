import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  const { conversationId } = useParams();
  const Access = getCookie("Access-Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference for auto-scrolling
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Get conversation ID from location state or params
  const stateNewsId = location.state?.newsItem?.id;
  const effectiveConversationId = stateNewsId || conversationId;

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch previous messages if conversation exists
    if (effectiveConversationId) {
      console.log('----------------------------------------');
      fetchConversationHistory(effectiveConversationId);
    }
  }, [effectiveConversationId]);

  const fetchConversationHistory = async (effectiveConversationId) => {
    try {
      const response = await fetch('/ai/api/getConv', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": Access
        },
        credentials: "include",
        body: JSON.stringify({
          // question: userInput,
          conversation_id : effectiveConversationId
          // conversation_id: effectiveConversationId
        }),

      });
      
      if (response.ok) {
        const data = await response.json();
        console.table(data);
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
      event.preventDefault(); // Prevent form submission if in a form
      
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
      {/* Main content area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for navbar height */}
        {/* Sidebar */}
        <Sidebar />
        
        {/* Chat area - adjusted to work with sidebar */}
        <div className="flex-1 ml-16 md:ml-16 lg:ml-16 transition-all duration-300 p-4 flex flex-col h-screen">
          {/* Chat title/header */}
          <div className="max-w-4xl mx-auto w-full mb-4 border-b border-[#DDBD8A] pb-2">
            <h2 className="text-xl font-bold text-[#A0153E]">
              {effectiveConversationId ? "Continue Conversation" : "New Conversation"}
            </h2>
          </div>
          
          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-[#FFCC81] scrollbar-track-[#fdfbee] pr-2"
            style={{ 
              height: "calc(100vh - 200px)",
              scrollbarWidth: "thin",
              scrollbarColor: "#FFCC81 #fdfbee"
            }}
          >
            <div className="flex flex-col gap-3 pb-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 my-8 p-6 border border-dashed border-[#DDBD8A] rounded-lg bg-white/50">
                  <p className="font-medium">Start a conversation with the Journalist</p>
                  <p className="text-sm mt-2 text-gray-400">Your messages will appear here</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-lg
                    ${message.isUser
                      ? "bg-[#F5E6CF] ml-auto"
                      : "bg-[#FFCC81] mr-auto"
                    }
                    animate-fadeIn transition-all duration-200 ease-in-out
                    `}
                >
                  <p className={`${message.isUser ? "text-right" : "text-left"} font-medium`}>
                    {message.isUser ? "" : "Journalist: "} 
                    <span className={`${message.isUser ? "text-[#A0153E]" : "text-black"}`}>
                      {message.text}
                    </span>
                  </p>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-500 italic max-w-[85%] sm:max-w-[75%] p-3 bg-[#FFCC81]/50 mr-auto rounded-lg shadow-sm border border-[#DDBD8A]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#A0153E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-[#A0153E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-[#A0153E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <p>Journalist is typing...</p>
                </div>
              )}
              
              {/* This empty div is used as a reference for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input area */}
          <div className="max-w-4xl mx-auto w-full sticky bottom-4">
            <div className="flex gap-2 items-center border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)] p-2 bg-white rounded-lg">
              <input
                type="text"
                value={newMessage}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 focus:outline-none hover:border-transparent bg-white/80 rounded"
              />
              <button
                className="border border-black px-4 py-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap text-sm sm:text-base bg-[#FFCC81] hover:bg-[#ffbb5c] transition-colors rounded font-medium text-[#A0153E]"
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