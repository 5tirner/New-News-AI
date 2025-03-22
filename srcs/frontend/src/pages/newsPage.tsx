import { useEffect } from "react";
import { getCookie } from "../utils/getCoockie";
import { useNews } from "../context/newsContext";
import { useNavigate } from "react-router-dom";
import { BiMessageDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const API_URL = '/ai/api/history'; 

const NewsPage = () => {
  const { news, removeNews, addNews } = useNews();
  const navigate = useNavigate();
  let Access = getCookie("Access-Token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": Access,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const json = await response.json();
        const historyArray = Object.values(json);

        historyArray.forEach((dataObj) => {
          const data = dataObj["notification"];
          const newNews = {
            title: data["formWhere"] === "Twitter" ? data["username"] : data["title"],
            content: data["formWhere"] === "Twitter" ? data["text"] : data["subj"],
            id: data["conversation_id"],
            from: data["formWhere"],
            username: data["formWhere"] === "Twitter" ? data["username"] : data["source"],
            date: data["formWhere"] === "Twitter" ? data["real_time"] : data["publishDate"],
            image: data["newsImage"] || undefined,
            url: data["newsUrl"] || undefined,
          };
          addNews(newNews);
        });

      } catch (e) {
        console.error("Error fetching history:", e);
      }
    };

    fetchHistory();
  }, [Access, addNews]); // Re-run if token changes
  
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gray-200 pt-16">
      {/* Main Section with matching style */}
      <div className="h-full flex flex-col overflow-hidden">
        <div className="text-center px-4 pt-8">
          <h2 className="text-4xl font-black text-[#A0153E] uppercase tracking-tight">NEWS FEED</h2>
          <p className="mt-2 text-gray-800 font-bold">What's happening today?</p>
        </div>

        {/* News Cards - This container will scroll */}
        <div className="flex-1 overflow-y-auto px-4 mt-8 pb-16">
          <div className="flex flex-col gap-6 items-center">
            {news.length > 0 ? (
              news.map((newsItem, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[90%] md:w-[80%] p-6 bg-[#FFCC81] rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200"
                >
                  <h3 className="font-black text-[#A0153E] text-xl uppercase">{newsItem.title}</h3>
                  <p className="mt-3 text-gray-900 font-medium">{newsItem.content}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 pt-4 border-t-2 border-black">
                    <div className="text-sm text-gray-800 font-bold">
                      <span className="uppercase">{newsItem.from}</span>
                      {newsItem.date && (
                        <span className="ml-2">• {new Date(newsItem.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex gap-3">
                      <button
                        onClick={() => navigate('/journalist', {state: {newsItem}})}
                        className="flex items-center px-4 py-2 bg-[#A0153E] text-white rounded border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                      >
                        <BiMessageDetail size={20} />
                        <span className="ml-2">TALK</span>
                      </button>
                      
                      <button
                        onClick={() => removeNews(index)}
                        className="flex items-center px-4 py-2 bg-[#ffbb5c] text-[#A0153E] rounded border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                      >
                        <MdDelete size={20} />
                        <span className="ml-2">DELETE</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center w-full bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
                <p className="text-gray-800 font-bold text-xl">NO NEWS AVAILABLE YET.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;