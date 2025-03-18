import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLogin from "./ProtectedFirstPage";
import Verification from "../pages/Verification";
import FirstPage from "../pages/FirstPage";
import NewsPage from "../pages/newsPage";

const AppRouter = () => {
  return (
      <Routes>

        <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route path="/signup" element={<ProtectedLogin><SignUp /></ProtectedLogin>} />
        <Route path="/verify" element={<ProtectedLogin><Verification/></ProtectedLogin>} />
        <Route path="/" element={<ProtectedLogin><FirstPage/></ProtectedLogin>} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />



        
        {/****              for Ahmed Bajaou test                 *****/}
{/* 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verification/>} />
        <Route path="/" element={<FirstPage/>} />
        <Route path="/home" element={< Home/>} /> 
        <Route path="/news" element={< NewsPage/>} /> */}

       


      </Routes>
  );
};

export default AppRouter;
