import { useState } from "react";

const NewsPage = () => {
  const newsData = [
    {
      title: "Real Madrid won UCL again",
      content:
        "Live: The final match between Real Madrid and Borussia Dortmund is finished, Real Madrid won 3 to one",
    },
    {
      title: "Real Madrid - Borussia Dortmund, Last Minute",
      content:
        "The UCL final almost finished, Real Madrid goes to make them 16.",
    },
  ];

  return (
    <div className="bg-[#fdfbee] min-h-screen">
 
      {/* Main Section */}
      <main className="p-10 text-center">
        <h2 className="text-3xl font-bold">Find Your News easy</h2>
        <p className="text-gray-600 mt-2">What’s new?</p>

        {/* News Result Button */}
        <div className="mt-4">
          <button className="border-2 border-black px-6 py-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            +99 News Result
          </button>
        </div>

        {/* News Cards */}
        <div className="mt-8 flex flex-col gap-6 items-center">
          {newsData.map((news, index) => (
            <div
              key={index}
              className="w-[80%] md:w-[60%] border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="font-bold">{news.title}</h3>
              <p className="text-sm mt-1">{news.content}</p>
              <button className="mt-4 border-2 border-black px-4 py-2 bg-gray-700 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Talk to Journalist!
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NewsPage;