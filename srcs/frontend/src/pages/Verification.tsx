import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

const API_URL = '/auth/api/verify';

const Verification = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const password = location.state?.password || "";
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

  const handleResend = async (e) => {
    e.preventDefault();
    // Add sign-up logic here
    try {
      const response = await fetch('/auth/api/signup', {
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
      
      console.log("redsend verification code ...");
      showAlert("The verification code sended successfully!", "success");
    } catch(e) {
      showAlert("An unexpected error occurred. Please try again later.", "error");
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
              <input maxLength={8} value={code} className="bg-gray-200 w-full h-10 border border-black flex text-center" onChange={(e) => setCode(e.target.value)} type="text" required />
              {/* <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required />
              <input maxLength={1} className="bg-gray-200 w-10 h-10 border border-black flex text-center" type="text" placeholder="" required /> */}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 border border-black text-white py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition"
          >
            Verify
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive a code? <span className="text-blue-500" onClick={handleResend}>Resend Code</span>
        </p>
      </div>
    </div>
  );
};

export default Verification;
