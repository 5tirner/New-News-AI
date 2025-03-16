import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const API_URL = `/auth/api/signin`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });

    // Add login logic here
    try {

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'email':email,
          'password':password
        })
      });

      if (!response.ok)
        throw new Error(`Response status : ${response.status}`);

      const json = await response.json();
      document.cookie = `Access-Token=${json["Access-Token"]}`;
      document.cookie = `Refresh-Token=${json["Refresh-Token"]}`;

      // localStorage.setItem("Access-Token", json["Access-Token"]);
      // localStorage.setItem("Refresh-Token", json["Refresh-Token"]);
      login();
      console.log(json);
      navigate('/home');

    } catch (error) {
      try{
        showAlert("Invalid email or password. Please try again.", "error");
      }catch (e) {
        console.log(e.message);
      }
      console.error("catch the Error here : "+error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition">
          <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google Logo" className="w-5 h-5" /> Login with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
