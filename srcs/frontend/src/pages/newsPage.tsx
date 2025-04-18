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
  const Access = getCookie("Access-Token"); // Changed from let to const

  useEffect(() => {
    let isMounted = true; // Add mounted flag
    const controller = new AbortController(); // Add abort controller

    const fetchHistory = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": Access,
          },
          credentials: "include",
          signal: controller.signal // Add abort signal
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const json = await response.json();

        // Only update if component is still mounted
        if (isMounted) {
          const historyArray = Object.values(json);
          // Clear existing news before adding new ones
          news.forEach((_, index) => removeNews(index));

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
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error("Error fetching history:", e);
      }
    };

    fetchHistory();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [Access]); // Remove addNews from dependencies

  return (
      <div className="min-h-screen bg-gray-200">
        <div className="pl-16 sm:pl-16 pt-[10vh]">
          <div className="h-[90vh] flex flex-col overflow-hidden">
            <div className="text-center px-4 pt-8">
              <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight">NEWS FEED</h2>
              <p className="mt-2 text-gray-600 font-bold">What's happening today?</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 mt-8 pb-16">
              <div className="flex flex-col gap-6 items-center max-w-[1200px] mx-auto">
                {news.length > 0 ? (
                  news.map((newsItem, index) => (
                    <div
                      key={index}
                      className="w-full p-6 bg-white rounded-lg border-4 border-gray-800 
                             shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] 
                             hover:translate-x-1 hover:translate-y-1 
                             hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] 
                             transition-all duration-200"
                    >
                      <h3 className="font-black text-gray-800 text-xl uppercase break-words">
                        {newsItem.title}
                      </h3>

                      <p className="mt-3 text-gray-700 font-medium break-words">
                        {newsItem.content}
                      </p>

                      {newsItem.image && (
                        <img
                          src={newsItem.image}
                          alt={newsItem.title}
                          className="mt-4 w-full h-48 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center 
                                  justify-between mt-5 pt-4 border-t-2 border-gray-400">
                        <div className="text-sm text-gray-600 font-bold">
                          <span className="uppercase">{newsItem.from}</span>
                          {newsItem.date && (
                            <span className="ml-2">• {new Date(newsItem.date).toLocaleDateString()}</span>
                          )}
                        </div>

                        <div className="mt-4 sm:mt-0 flex gap-3">
                          <button
                            onClick={() => navigate('/journalist', { state: { newsItem } })}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 
                                   bg-gray-800 text-white rounded border-2 border-gray-800 
                                   font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] 
                                   hover:translate-x-1 hover:translate-y-1 hover:shadow-none 
                                   transition-all duration-200"
                          >
                            <BiMessageDetail size={20} />
                            <span className="ml-2">TALK</span>
                          </button>

                          <button
                            onClick={() => removeNews(index)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 
                                   bg-gray-200 text-gray-800 rounded border-2 border-gray-800 
                                   font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] 
                                   hover:translate-x-1 hover:translate-y-1 hover:shadow-none 
                                   transition-all duration-200"
                          >
                            <MdDelete size={20} />
                            <span className="ml-2">DELETE</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center w-full max-w-2xl bg-white 
                              border-4 border-gray-800 rounded-lg 
                              shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)]">
                    <p className="text-gray-800 font-bold text-xl">NO NEWS AVAILABLE YET.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default NewsPage;