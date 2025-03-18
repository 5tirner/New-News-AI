import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

const API_URL = '/auth/api/verify';

const Verification = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 8) {
      showAlert("The verification code must be exactly 7 characters.", "error");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          "verification_code": code,
          email
        })
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json);
      }

      showAlert("Account created successfully! You can now log in.", "success");
      navigate('/login');

    } catch (error) {

      showAlert("The verification code does not correct.", "error");
      console.log("Error from backend");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f2e7] p-4">
      <div className="w-full max-w-md bg-white p-6 border border shadow-[2px_2px_0px_rgba(0,0,0,1)] ">
        <h2 className="text-2xl font-semibold text-center mb-4">Email Verification</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the verification code sent to your email to complete your signup.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center flex-col gap-3">
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <div className="flex items-center gap-2 ">

              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
            </div>

            {/* <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)} // Convert to uppercase  .toUpperCase()
              className="w-full mt-1 p-2 border border-gray-300 bg-[#f6f2e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              maxLength={8}
              required
            /> */}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 border border-black text-white py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition"
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
