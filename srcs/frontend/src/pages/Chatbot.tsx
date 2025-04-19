import React, { useState, useRef, useEffect } from "react";
import { BiMessageSquareDots } from "react-icons/bi"; // Chatbot icon
import { IoClose } from "react-icons/io5"; // Close icon

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(""); // New message input
  const messagesEndRef = useRef(null); // For auto-scrolling

  // Scroll to the bottom of the chat when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = { text: newMessage, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");

    try {
      const response = await fetch("/ai/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response");
      }

      const data = await response.json();
      const botMessage = { text: data.answer, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = { text: "Sorry, something went wrong.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-8 w-80 max-w-full h-[500px] bg-white rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] flex flex-col z-50 border-4 border-gray-800">
      {/* Chatbot Header */}
      <div className="flex justify-between items-center p-4 bg-gray-200 border-b-4 border-gray-800">
        <h2 className="text-lg font-bold text-gray-800 uppercase">Chatbot</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close Chatbot"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                message.isUser
                  ? "bg-gray-800 text-white self-end shadow-md"
                  : "bg-gray-300 text-gray-800 self-start shadow-md"
              }`}
            >
              {message.text}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Start a conversation...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-200 border-t-4 border-gray-800">
        <div className="flex items-center gap-3 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
          />
          <button
            onClick={handleSendMessage}
            className="bg-gray-800 text-white px-5 py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all text-sm sm:text-base font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;