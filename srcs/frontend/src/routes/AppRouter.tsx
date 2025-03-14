import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Teams from "../pages/Teams";
import Tournaments from "../pages/Tournaments";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Verification from "../pages/Verification";

const AppRouter = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={< Verification/>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
      </Routes>
  );
};

export default AppRouter;
