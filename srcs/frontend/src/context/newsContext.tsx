import { createContext, useContext, useState } from "react";

export interface NewsItem {
  id: string;
  from: string;
  username: string;
  date: string;
  title: string;
  content: string;
  image: string | undefined;
  url: string | undefined;
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
    setNews((prevNews) => [newItem, ...prevNews]); 
  };

  const removeNews = (index: number) => {
    setNews((prevNews) => prevNews.filter((_, i) => i !== index)); 
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
