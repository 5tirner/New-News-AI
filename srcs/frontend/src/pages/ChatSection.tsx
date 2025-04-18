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
          conversation_id : effectiveConversationId
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
        console.log(botResponse);
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
    <div className="flex flex-col min-h-screen bg-gray-200">
      {/* Main content area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for navbar height */}
        {/* Sidebar */}
        <Sidebar />
        
        {/* Chat area - adjusted to work with sidebar */}
        <div className="flex-1 ml-16 md:ml-16 lg:ml-16 transition-all duration-300 p-4 flex flex-col h-screen">
          {/* Chat title/header */}
          <div className="max-w-4xl mx-auto w-full mb-4 border-b-4 border-gray-400 pb-2">
            <h2 className="text-2xl font-black text-gray-800 uppercase">
              {effectiveConversationId ? "CONTINUE CONVERSATION" : "NEW CONVERSATION"}
            </h2>
          </div>
          
          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-2"
            style={{ 
              height: "calc(100vh - 200px)",
              scrollbarWidth: "thin",
              scrollbarColor: "#9CA3AF #E5E7EB"
            }}
          >
            <div className="flex flex-col gap-4 pb-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-600 my-8 p-6 border-4 border-dashed border-gray-400 rounded-lg bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)]">
                  <p className="font-bold uppercase text-lg">Start a conversation</p>
                  <p className="text-sm mt-2 text-gray-500">Your messages will appear here</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] sm:max-w-[75%] p-4 border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] rounded-lg
                    ${message.isUser
                      ? "bg-white ml-auto"
                      : "bg-gray-100 mr-auto"
                    }
                    hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200
                    `}
                >
                  <p className={`${message.isUser ? "text-right" : "text-left"} font-bold`}>
                    {message.isUser ? "" : "JOURNALIST: "} 
                    <span className={`${message.isUser ? "text-gray-800" : "text-gray-700"}`}>
                      {message.text}
                    </span>
                  </p>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-600 italic max-w-[85%] sm:max-w-[75%] p-3 bg-gray-100 mr-auto rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <p className="font-bold">JOURNALIST IS TYPING...</p>
                </div>
              )}
              
              {/* This empty div is used as a reference for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input area */}
          <div className="max-w-4xl mx-auto w-full sticky bottom-4">
            <div className="flex gap-2 items-center border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] p-2 bg-white rounded-lg">
              <input
                type="text"
                value={newMessage}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 focus:outline-none bg-white/80 rounded font-medium"
              />
              <button
                className="border-4 border-gray-800 px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] whitespace-nowrap text-sm sm:text-base bg-gray-800 text-white hover:bg-gray-700 transition-colors rounded font-bold uppercase"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? "..." : "SEND"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;