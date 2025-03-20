import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useNews } from "../context/newsContext";

// Move to environment variables or configuration file in production
const WS_URL = "ws://"+window.location.host+"/livenews/";
const RECONNECT_INTERVAL = 10000; // 5 seconds

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, hasRegisteredFields } = useAuth();
  const { showAlert } = useAlert();
  const { news, addNews } = useNews();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  
  const connectWebSocket = () => {
    if (!isAuthenticated || isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      socketRef.current = new WebSocket(WS_URL);
      


      socketRef.current.onmessage = (e) => {
        try {
          let data = JSON.parse(e.data);
          
          // Process the news data
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
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      socketRef.current.onclose = (event) => {
        setIsConnecting(false);
        
        // Attempt to reconnect unless this was a normal closure
        if (event.code !== 1000 && isAuthenticated) {
          reconnectTimeoutRef.current = window.setTimeout(connectWebSocket, RECONNECT_INTERVAL);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("⚠️ WebSocket Error:", error);
        // Let onclose handle reconnection
      };
    } catch (error) {
      setIsConnecting(false);
      
      // Attempt to reconnect
      reconnectTimeoutRef.current = window.setTimeout(connectWebSocket, RECONNECT_INTERVAL);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRegisteredFields) {
      connectWebSocket();
    } else if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      
      // Show alert only when actively disconnecting (not initial load)
      if (document.readyState === "complete") {
        showAlert("You must be logged in to access this page.", "error");
      }
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [isAuthenticated, hasRegisteredFields]);


  if (!isAuthenticated) {  
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;