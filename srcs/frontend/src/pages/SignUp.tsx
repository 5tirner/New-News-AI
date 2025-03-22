import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

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
    <div className="min-h-screen flex items-center justify-center bg-white p-3">
      <div className="w-full max-w-md bg-[#FFCC81] p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#A0153E] text-center mb-3">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-[#ffbb5c] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A0153E]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-[#ffbb5c] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A0153E] pr-10"
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
            <label className="block text-xs font-medium text-gray-800 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-[#ffbb5c] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A0153E] pr-10"
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
            className="w-full bg-[#A0153E] text-white py-2 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#FFCC81] text-gray-800">Or continue with</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button className="w-full flex items-center justify-center gap-2 bg-[#ffbb5c] text-[#A0153E] font-medium py-2 rounded hover:bg-opacity-90 transition-colors text-sm">
            <FaGoogle size={14} />
            <span>Sign Up with Google</span>
          </button>
        </div>

        <p className="text-center text-gray-800 mt-3 text-xs">
          Already have an account? {" "}
          <Link to="/login" className="text-[#A0153E] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;