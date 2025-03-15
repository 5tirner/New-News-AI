import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedLogin = ({ children } : {children : JSX.Element }) => {
    const {isAuthenticated} = useAuth();

    return isAuthenticated ? <Navigate to='/home' replace /> : children; 
}

export default ProtectedLogin;