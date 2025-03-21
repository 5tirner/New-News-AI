import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

// import  FieldSection  from "../pages/FieldPage";

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

      const json = await response.json();
      if(response.status == 401){
        navigate("/verify", {state : {email, password}});
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
  }, [isAuthenticated, hasRegisteredFields]);
  
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

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)] "
              required
            />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-5 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-500 h-10 flex items-center justify-center text-white py-2 border-black border shadow-[4px_4px_0px_rgba(0,0,0,1)] transition"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              </svg>
            ) : null}
            {isLoading ? "" : "Sign in"}
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
