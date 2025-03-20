import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useEffect, useRef } from "react";
import { useNews } from "../context/newsContext";

const WS_URL = "/livenews/";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const { news, addNews } = useNews();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      showAlert("You must be logged in to access this page.", "error");
      return;
    }

    socketRef.current = new WebSocket(WS_URL);
    
    socketRef.current.onopen = () => {
      console.log("WebSocket connected.");
    };

    socketRef.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("Received message:", data);
      console.log("--------------------------");
      console.log("From :", data["formWhere"]);


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
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed.");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      if (socketRef.current) {
        console.log("🔴 Closing WebSocket...");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    console.log("📢 All News Updated:", news);
  }, [news]);


  if (!isAuthenticated) {
    console.log("⛔ You don't have access to this page...");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
