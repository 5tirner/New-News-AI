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
    <div className="fixed top-0 left-0 w-full h-screen bg-white pt-16">
      {/* Main Section with matching style */}
      <div className="h-full flex flex-col overflow-hidden">
        <div className="text-center px-4 pt-8">
          <h2 className="text-3xl font-bold text-[#A0153E]">Find Your News Easily</h2>
          <p className="mt-2 text-gray-700">What's new today?</p>
        </div>

        {/* News Cards - This container will scroll */}
        <div className="flex-1 overflow-y-auto px-4 mt-8 pb-16">
          <div className="flex flex-col gap-4 items-center">
            {news.length > 0 ? (
              news.map((newsItem, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[90%] md:w-[80%] p-5 bg-[#FFCC81] rounded shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="font-bold text-[#A0153E] text-lg">{newsItem.title}</h3>
                  <p className="mt-2 text-gray-800">{newsItem.content}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                      <span>{newsItem.from}</span>
                      {newsItem.date && (
                        <span className="ml-2">• {new Date(newsItem.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 sm:mt-0 flex gap-2">
                      <button
                        onClick={() => navigate('/journalist', {state: {newsItem}})}
                        className="flex items-center px-4 py-2 bg-[#A0153E] text-white rounded hover:bg-opacity-90 transition-colors"
                      >
                        <BiMessageDetail size={20} />
                        <span className="ml-2">Talk to Journalist</span>
                      </button>
                      
                      <button
                        onClick={() => removeNews(index)}
                        className="flex items-center px-4 py-2 bg-[#ffbb5c] text-[#A0153E] rounded hover:bg-opacity-90 transition-colors"
                      >
                        <MdDelete size={20} />
                        <span className="ml-2">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center w-full">
                <p className="text-gray-500">No news available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;