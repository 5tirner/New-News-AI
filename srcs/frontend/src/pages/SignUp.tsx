import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { FaGoogle, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";

const API_URL = '/auth/api/signup';

const SignUp = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert("Passwords do not match. Please try again.", "error");
      return;
    }
    if (password.length < 8) {
      showAlert("Password must be at least 8 characters long.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'email': email,
          'password': password
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data["Weak Password"] || data["email"]);
      }
      
      navigate('/verify', { state: { email, password } });

    } catch(e) {
      showAlert(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center p-2">
      <main className="flex flex-col items-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        
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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-1 text-left">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border-2 border-gray-800 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-600 pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
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
                <FaUserPlus className="mr-2" />
              )}
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-px bg-gray-300 flex-grow"></div>
              <span className="text-xs text-gray-600">Or</span>
              <div className="h-px bg-gray-300 flex-grow"></div>
            </div>

            <button type="button" className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-800 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 font-bold">
              <FaGoogle className="mr-2" />
              Sign Up with Google
            </button>
          </form>
        </div>
        
        <div className="mt-3 bg-gray-100 p-2 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
          <p className="text-gray-800 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-gray-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;