import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLogin from "./ProtectedFirstPage";
import Verification from "../pages/Verification";
import FirstPage from "../pages/FirstPage";

const AppRouter = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route path="/signup" element={<ProtectedLogin><SignUp /></ProtectedLogin>} />
        <Route path="/verify" element={<ProtectedLogin><Verification/></ProtectedLogin>} />



        {/* <Route path="/home" element={< Home/>} /> */}
        <Route path="/" element={<ProtectedLogin><FirstPage/></ProtectedLogin>} />
        

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
  );
};

export default AppRouter;
