import { useState } from "react";

type News = {
  title: string;
  content: string;
};

export const useNews = () => {
  const [news, setNews] = useState<News[]>([
    {
      title: "Real Madrid won UCL again",
      content:
        "Live: The final match between Real Madrid and Borussia Dortmund is finished, Real Madrid won 3 to one",
    },
  ]);

  // Function to add a news item
  const addNews = (newItem: News) => {
    setNews((prevNews) => [newItem, ...prevNews]);
  };

  // Function to remove a news item by index
  const removeNews = (index: number) => {
    setNews((prevNews) => prevNews.filter((_, i) => i !== index));
  };

  // Function to update a news item by index
  const updateNews = (index: number, updatedItem: News) => {
    setNews((prevNews) =>
      prevNews.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  return { news, addNews, removeNews, updateNews };
};
