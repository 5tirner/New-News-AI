import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";


const API_URL = '/auth/api/signup';

const SignUp = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert("Passwords do not match. Please try again.", "error");
      return;
    }
    console.log("Signing up with", { name, email, password });


    // Add sign-up logic here
    try {
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'email' : email,
          'password' : password
        })
      });
      if (!response.ok)
        throw new Error("from backend ,Error status : " + response.status);
      
      console.log("redirecting to verification ...");
      navigate('/verify', { state: { email } });

    } catch(e) {
      console.log(e.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f2e7] p-4">
      <div className="w-full max-w-md bg-[#F5E6CF] p-6 border border-[#DDBD8A] rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 bg-[#f6f2e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 bg-[#f6f2e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition">
          <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google Logo" className="w-5 h-5" /> Sign Up with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
