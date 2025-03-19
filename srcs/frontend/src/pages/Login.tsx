import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

// import  FieldSection  from "../pages/FieldPage";

const API_URL = `/auth/api/signin`;

const Login = () => {
  const navigate = useNavigate();
  // const field = FieldSection();
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
      // field();

      navigate('/Field')
      console.log(json);

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
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbee] p-4">
      <div className="w-full max-w-md bg-white p-6  border border-black  shadow-[4px_4px_0px_rgba(0,0,0,1)] ">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)] "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)] "
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)] transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-white-500 text-black py-2  border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)]  transition">
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
