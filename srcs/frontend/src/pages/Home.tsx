
import NewsPage from "./newsPage";
import Sidebar from "../components/Sidebar";


const Home = () => {
  return (
    <div className="flex h-screen bg-[#fdfbee]">
      {/*  SideBar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-light lm:p-10 md:4 flex flex-col items-center">
      <NewsPage  /> 
      </div >
    </div >
  );
};

export default Home;


// return (
//   <>
//     <div className="min-h-screen flex flex-row bg-[#fdfbee]">
//       <Sidebar/>
//       <div className="w-[100%] p-5  flex flex-col items-center justify-center gap-5">
//         <div className="w-[50%] text-right">
//           <button className="bg-gray-200  w-[15%]  text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" onClick={() => navigate(-1)} >Back</button>
//         </div>
//         <div className=" md:h-96 lg:h-96 w-[50%] flex flex-col items-center justify-center gap-5 border border-black">

//           <div className="w-[100%] flex flex-col gap-2 items-center justify-center overflow-y-auto">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`w-[100%] p-2 border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)]  ${message.isUser ? "bg-[#F5E6CF] self-end" : "bg-gray-200 self-start"
//                   }`}
//               >
//                 <p className={message.isUser ? "text-right" : "text-left"}>
//                   {message.isUser ? "" : "Journalist: "} {message.text}
//                 </p>
//               </div>
//             ))}
//             {isLoading && <p className="text-gray-500 italic "> Journalist is typing...</p>}
//           </div>
//           <div className=" w-full h-[10%] flex gap-5 items-center justify-center border-black border shadow-[2px_2px_0px_rgba(0,0,0,1)] ">
//             <input
//               type="text"
//               value={newMessage}
//               onKeyDown={handleSendMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="w-[80%] p-2 h-[100%] focus:outline-none hover:border-transparent"
//             />
//             <button
//               className="border border-black size-fit w-[10%] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
//               onClick={handleSendMessage}
//               disabled={isLoading} // Disable button when bot is responding
//             >
//               {isLoading ? "..." : "Send"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );
// };