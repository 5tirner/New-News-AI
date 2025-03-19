import { useNews } from "../context/newsContext";

const NewsPage = ({ setIsFirstVisible }: { setIsFirstVisible: (visible: boolean) => void }) => {
  const { news, removeNews } = useNews();

  return (
    <div className="min-h-screen">
      {/* Main Section */}
      <main className="p-10 text-center">
        <h2 className="text-3xl font-bold">Find Your News Easily</h2>
        <p className="text-gray-600 mt-2">What’s new?</p>

        {/* News Cards */}
        <div className="overflow-y-auto mt-8 flex flex-wrap gap-6 items-center justify-center">
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
                    onClick={() => setIsFirstVisible(false)}
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
