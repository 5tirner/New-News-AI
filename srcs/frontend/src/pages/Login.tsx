import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = `/auth/api/signin`;

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRegisteredFields, login } = useAuth();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'email': email,
          'password': password
        })
      });

      const json = await response.json();
      if(response.status == 401){
        navigate("/verify", {state: {email, password}});
        return;
      }

      if (!response.ok){
        throw new Error(json["email"]);
      }

      document.cookie = `Access-Token=${json["Access-Token"]}`;
      login(json["isSelectFields"]);

    } catch (error) {
      showAlert("Invalid email or password. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (hasRegisteredFields)
        navigate("/home");
      else
        navigate("/field");
    }
  }, [isAuthenticated, hasRegisteredFields, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-[#FFCC81] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#A0153E] text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#ffbb5c] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A0153E]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#ffbb5c] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A0153E] pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#A0153E] text-white py-3 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FFCC81] text-gray-800">Or continue with</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-2 bg-[#ffbb5c] text-[#A0153E] font-medium py-3 rounded hover:bg-opacity-90 transition-colors">
            <FaGoogle size={18} />
            <span>Login with Google</span>
          </button>
        </div>

        <p className="text-center text-gray-800 mt-6">
          Don't have an account? {" "}
          <Link to="/signup" className="text-[#A0153E] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;