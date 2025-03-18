import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useEffect } from "react";

const WS_URL = '/livenews/';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isAuthenticated) {
      showAlert("You must be logged in to access this page.", "error");
    }
  }, [isAuthenticated]);

  if (isAuthenticated){

    let socket = new WebSocket(WS_URL);
    
    socket.onopen = () => {
      console.log("websocket is connecting ...");
    };
    socket.onmessage = (e) => {
      console.log("recieved message :"+e);
    };
    socket.onclose = (e) => {
      console.log("websocket closed!")
    };
    return children; 
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
