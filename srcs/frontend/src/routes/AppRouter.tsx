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
        <Route path="/" element={<ProtectedLogin><FirstPage/></ProtectedLogin>} />
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />



        
        {/****              for Ahmed Bajaou test                 *****/}

        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verification/>} />
        <Route path="/" element={<FirstPage/>} />
        <Route path="/home" element={< Home/>} /> */}


      </Routes>
  );
};

export default AppRouter;
