import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { getCookie } from "../utils/getCoockie";
import { useAlert } from "./AlertContext";
import { useNavigate } from "react-router-dom";

// Define types for AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  login:  () => void;
  logout: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = '/auth/api/profile';


// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  console.log("i call AuthProvider() for ", children);
  
  const navigate = useNavigate();
  const {showAlert} = useAlert();
  let Access = getCookie("Access-Token");
  let Refresh = getCookie("Refresh-Token");

  const checkAuth = async () => {
    console.log(`Access-Token:${Access}`);
    console.log(`Refresh-Token:${Refresh}`);
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
        throw new Error(json);
      setIsAuthenticated(true);
    } catch(e) {
      showAlert("You must be logged in to access this page.", "error");
      if (isAuthenticated)
        setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  

  const login = () => {
      showAlert("Login successful! Welcome back.", "success");
      setIsAuthenticated(true);
  };

  const logout = () => {
    showAlert("Logout successful. See you soon!", "success");
    setIsAuthenticated(false);
    document.cookie = "Access-Token="; // Remove token
    document.cookie = "Refresh-Token="; // Remove token
    navigate("/");
  };
  
  const authContextValue = { isAuthenticated, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
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
