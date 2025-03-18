import { createContext, useContext, useState } from "react";

interface NewsItem {
  title: string;
  content: string;
}

interface NewsContextType {
  news: NewsItem[];
  addNews: (newItem: NewsItem) => void;
  removeNews: (index: number) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNews] = useState<NewsItem[]>([]);

  const addNews = (newItem: NewsItem) => {
    setNews((prevNews) => [newItem, ...prevNews]); // ✅ Add new news at the top
  };

  const removeNews = (index: number) => {
    setNews((prevNews) => prevNews.filter((_, i) => i !== index)); // ✅ Remove by index
  };

  return (
    <NewsContext.Provider value={{ news, addNews, removeNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
