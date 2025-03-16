import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isAuthenticated) {
      showAlert("You must be logged in to access this page.", "error");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return children;
  
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
