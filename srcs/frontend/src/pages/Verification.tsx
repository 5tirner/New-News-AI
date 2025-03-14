import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = '/auth/api/verify';

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 8) {
      setError("The verification code must be exactly 7 characters.");
      return;
    }

    console.log("Verifying code:", code);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          "Content-type":"application/json",
        },
        body: JSON.stringify({
          "verification_code": code,
          email
        })
      });

      const json = await response.json();
      if (!response.ok)
      {
        throw new Error(json);
      }
      navigate('/login');

    } catch (error) {

      console.log("Error from backend");
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Email Verification</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the verification code sent to your email to complete your signup.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())} // Convert to uppercase
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              maxLength={8}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Verify
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive a code? <a href="/resend-code" className="text-blue-500">Resend Code</a>
        </p>
      </div>
    </div>
  );
};

export default Verification;
