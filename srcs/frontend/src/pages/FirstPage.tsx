import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center p-4">
      <main className="flex flex-col items-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800">What is Journalist?</h1>
        
        <div className="mt-6 bg-white p-6 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
          <p className="text-lg text-gray-800">
            <strong>Journalist AI</strong> – Your Trusted Partner for Staying Informed Across All Fields.
          </p>
          <p className="text-md text-gray-700 mt-4">
            Stay ahead with real-time news updates and seamless tracking.
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-4">
            No more misinformation—just reliable news.
          </p>
        </div>
        
        <div className="mt-8 bg-gray-100 p-6 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
          <p className="text-lg font-semibold text-gray-800">Subscribe now!</p>
          <p className="text-sm text-gray-600 mt-1">More than +99 news</p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate("/signup")} 
              className="flex items-center px-6 py-3 bg-white text-gray-800 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 w-full sm:w-auto justify-center font-bold"
            >
              <FaUserPlus className="mr-2" />
              Sign up
            </button>
            
            <span className="text-gray-800 font-semibold hidden sm:block">or</span>
            
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 w-full sm:w-auto justify-center font-bold"
            >
              <FaSignInAlt className="mr-2" />
              Sign in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FirstPage;