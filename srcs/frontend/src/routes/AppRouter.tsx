import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Verification from "../pages/Verification";
import FirstPage from "../pages/FirstPage";

const AppRouter = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={< Verification/>} />
        <Route path="/home" element={< Home/>} />
        <Route path="/" element={< FirstPage/>} />
        

        {/* Protected Routes */}
        {/* <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
      </Routes>
  );
};

export default AppRouter;
