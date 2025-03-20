

import { useState } from "react";


const ChatSection = ({ setIsFirstVisible }) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for bot response

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage(""); // Clear input field
      setIsLoading(true); // Show loading state
      try {
        const botResponse = await fetchBotResponse(newMessage);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, isUser: false }]);
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
    const response = await fetch("ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput , conversation_id : "conv21" }),
    });

    const data = await response.json();
    return data.reply || "I couldn't understand that. Try asking something else!";
  };

  return (
    <>
      <div className="w-[100%] text-right">
        <button className="bg-gray-200  w-[5%]  text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] border border-black" onClick={() => setIsFirstVisible(true)} >Back</button>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-end gap-5">

        <div className="w-[84%] flex flex-col gap-2 items-center justify-center">
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
    </>
  );
};

export default ChatSection;