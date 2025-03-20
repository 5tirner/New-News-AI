import { useEffect } from "react";
import { getCookie } from "../utils/getCoockie";
import { useNews } from "../context/newsContext";
import { useNavigate } from "react-router-dom";

const API_URL = '/ai/api/history'; 

const NewsPage = () => {
  const { news, removeNews , addNews} = useNews();
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
  }, [Access]); // Re-run if token changes
  
  return (
    <div className="fixed top-0 left-0 py-24 px-10 min-h-screen w-full">
      {/* Main Section */}
      <main className=" w-full text-center">
        <h2 className="text-3xl font-bold">Find Your News Easily</h2>
        <p className="text-gray-600 mt-2">What’s new?</p>

        {/* News Cards */}
        <div className=" w-full h-dvh mt-8 flex flex-col gap-6 items-center justify-start overflow-y-auto ">
        {news.length > 0 ? (
            news.map((newsItem, index) => (
              <div
                key={index}
                className="w-[80%] md:w-[60%] p-4 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left"
              >
                <h3 className="font-bold">{newsItem.title}</h3>
                <p className="text-sm mt-1">{newsItem.content}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate('/journalist', {state : {newsItem}})}
                    className="border-2 border-black px-4 py-2 bg-gray-700 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    Talk to Journalist!
                  </button>
                  <button
                    onClick={() => removeNews(index)}
                    className="border-2 border-black px-4 py-2 bg-red-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No news available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewsPage;
