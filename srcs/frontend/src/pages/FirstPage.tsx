import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
      <main className="flex flex-col items-center max-w-2xl">
        <h1 className="text-4xl font-bold text-[#A0153E]">What is Journalist?</h1>
        
        <div className="mt-6 bg-[#FFCC81] p-6 rounded-lg shadow-md w-full">
          <p className="text-lg text-gray-800">
            <strong>Journalist AI</strong> – Your Trusted Partner for Staying Informed Across All Fields.
          </p>
          <p className="text-md text-gray-700 mt-4">
            Stay ahead with real-time news updates and seamless tracking.
          </p>
          <p className="text-lg font-semibold text-[#A0153E] mt-4">
            No more misinformation—just reliable news.
          </p>
        </div>
        
        <div className="mt-8 bg-white p-4 border-2 border-[#FFCC81] rounded-lg w-full">
          <p className="text-lg font-semibold text-[#A0153E]">Subscribe now!</p>
          <p className="text-sm text-gray-600 mt-1">More than +99 news</p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate("/signup")} 
              className="flex items-center px-6 py-3 bg-[#A0153E] text-white rounded hover:bg-opacity-90 transition-colors w-full sm:w-auto justify-center"
            >
              <FaUserPlus className="mr-2" />
              Sign up
            </button>
            
            <span className="text-gray-800 font-semibold hidden sm:block">or</span>
            
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center px-6 py-3 bg-[#ffbb5c] text-[#A0153E] rounded hover:bg-opacity-90 transition-colors w-full sm:w-auto justify-center"
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