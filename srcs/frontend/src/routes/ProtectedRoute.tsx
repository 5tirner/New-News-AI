import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useEffect, useRef } from "react";
import { useNews } from "../context/newsContext"; // Use context instead of hooks directory

const WS_URL = "/livenews/";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const { news, addNews } = useNews();
  const socketRef = useRef<WebSocket | null>(null); // ✅ Keep WebSocket reference

  useEffect(() => {
    if (!isAuthenticated) {
      showAlert("You must be logged in to access this page.", "error");
      return;
    }

    // ✅ Open WebSocket only once
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected.");
    };

    socketRef.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("Received message:", data);
      console.log("--------------------------");
      console.log("From :", data["formWhere"]);


      if (data["formWhere"] === "Twitter") {
        console.log("title:", data["username"]);
        console.log("text:", data["text"]);
        addNews({
          title: `${data["username"]}`,
          content: `${data["text"]}`,
        });
      } else if (data["formWhere"] === "NEWS") {
        console.log("title:", data["title"]);
        console.log("text:", data["subj"]);
        addNews({
          title: `${data["title"]}`,
          content: `${data["subj"]}`,
        });
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed.");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // ✅ Cleanup function to close WebSocket
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isAuthenticated]); // ✅ Depend only on `isAuthenticated`

  useEffect(() => {
    console.log("All News :", news);
  }, [news]);

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
