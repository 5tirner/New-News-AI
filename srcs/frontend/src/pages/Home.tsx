
import { useState } from "react";


const ChatSection = () => {
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
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    return data.reply || "I couldn't understand that. Try asking something else!";
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-end gap-5">
      <div className="w-[84%] flex flex-col gap-2 items-center justify-center">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`w-[100%] p-2 border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)]  ${
              message.isUser ? "bg-[#F5E6CF] self-end" : "bg-gray-200 self-start"
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
  );
};

function NewsFieldsPage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isField, setField] = useState([]);
  
  const [isFirstVisible, setIsFirstVisible] = useState(true);


  const handleFieldSelection = (field) => {
    if (!isField.includes(field)) {
      setField([...isField, field]);
    }
    setIsFirstVisible(false)
  };
  const handleBacktoField = () => {
    setIsFirstVisible(true)

  }
  return (
    <div className="flex h-screen bg-[#fdfbee]">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-[#F5E6CF] transition-all duration-300 p-4 flex flex-col`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className=" text-white p-2 rounded text-right"
        >
          {isSidebarOpen ? "⬅" : "➡"}
        </button>

        {isSidebarOpen && (
          <>
            <h2 className="font-bold mt-4">Fields</h2>
            <ul>
            {isField.map((field, index) => (
              <li key={index} className="mt-2">⚫ {field}</li>
            ))}
            </ul>
            <h2 className="font-bold mt-4">History</h2>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-light p-10 flex flex-col items-center">
        {isFirstVisible && isField ? (
          <>
                <h1 className="text-xl font-bold">Choose Your News Fields</h1>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={() => handleFieldSelection("Football")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
                    Football
                  </button>
                  <button onClick={() => handleFieldSelection("Web Dev")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
                    Web Dev
                  </button>
                  <button onClick={() => handleFieldSelection("Technology")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
                    Technology
                  </button>
                  <button onClick={() => handleFieldSelection("Business")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
                    Business
                  </button>
                </div>
          </>
        ) : (
          <div className="w-[100%] h-[100%] flex flex-col items-end">
          <button onClick={() => handleBacktoField()} className="border-black w-20 border-2 px-4 py-2  bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    Back
            </button>
            <ChatSection/>
          </div>
        )}

      </div>
    </div>
  );
}


const Home = () => {
    return (
      // <div className="p-6 flex justify-center items-center">
          <NewsFieldsPage/>
      // </div>
    );
  };
  
  export default Home;
  