import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center p-2">
      <main className="flex flex-col items-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        
        <div className="mt-3 bg-white p-4 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1 text-left">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-2 border-gray-800 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-1 text-left">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border-2 border-gray-800 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-600 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 font-bold mt-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-px bg-gray-300 flex-grow"></div>
              <span className="text-xs text-gray-600">Or</span>
              <div className="h-px bg-gray-300 flex-grow"></div>
            </div>

            <button type="button" className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-800 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 font-bold">
              <FaGoogle className="mr-2" />
              Sign In with Google
            </button>
          </form>
        </div>
        
        <div className="mt-3 bg-gray-100 p-2 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
          <p className="text-gray-800 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-gray-800 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;