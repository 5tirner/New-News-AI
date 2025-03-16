import { createContext, useContext, useState, ReactNode } from "react";
import { getCookie } from "../utils/getCoockie";
import { useAlert } from "./AlertContext";

// Define types for AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = '/auth/api/profile';
const WS_URL = '/livenews/';

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {showAlert} = useAlert();
  let Access = getCookie("Access-Token");
  let Refresh = getCookie("Refresh-Token");

  console.log(`${Access}, ${Refresh}`);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Access !== null || Refresh !== null  // Check if user is logged in
  );

  const checkAuth = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok)
        throw new Error("from backend : " + json);
      setIsAuthenticated(true);
    } catch(e) {
      setIsAuthenticated(false);
      console.log(e.message);
    }
  };

  checkAuth();

  const login = () => {
    showAlert("Login successful! Welcome back.", "success");
    setIsAuthenticated(true);
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
  };

  const logout = () => {
    showAlert("Logout successful. See you soon!", "success");
    setIsAuthenticated(false);
    document.cookie = "Access-Token="; // Remove token
    document.cookie = "Refresh-Token="; // Remove token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
