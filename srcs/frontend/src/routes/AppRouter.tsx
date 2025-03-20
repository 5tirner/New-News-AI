import { Routes, Route, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLogin from "./ProtectedFirstPage";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const Verification = lazy(() => import("../pages/Verification"));
const FirstPage = lazy(() => import("../pages/FirstPage"));
const NewsPage = lazy(() => import("../pages/newsPage"));
const FieldSection = lazy(() => import("../pages/FieldPage"));
const ChatSection = lazy(() => import("../pages/ChatSection"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
      <Routes>
        
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} /> 
        <Route path="/journalist" element={<ProtectedRoute><ChatSection/></ProtectedRoute>}/>
        <Route path="/field" element={<ProtectedRoute><FieldSection /></ProtectedRoute>} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<ProtectedLogin><SignUp /></ProtectedLogin>} />
        <Route path="/verify" element={<ProtectedLogin><Verification /></ProtectedLogin>} />
        <Route path="/" element={<FirstPage />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;