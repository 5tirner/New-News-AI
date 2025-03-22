
// import { useState } from "react";
import { getCookie } from "../utils/getCoockie";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/getCoockie"; // Assuming this is the correct import path
import { useAuth } from "../context/AuthContext"; // Assuming you have an auth context

const FieldSection = () => {
    let Access = getCookie("Access-Token");
    const [selectedFields, setSelectedFields] = useState([]);
    const { setField } = useAuth();
    const navigate = useNavigate();

    const handleFieldSelection = (field) => {
        setSelectedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field) // Remove if already selected
                : [...prevFields, field] // Add if not selected
        );
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("/auth/api/fields", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Token": Access
                },
                credentials: 'include',
                body: JSON.stringify({ fields: selectedFields })
            });
            if (response.ok) {
                setField(true);
                navigate("/home");
            } else {
                console.error("Failed to submit fields");
            }
        } catch (error) {
            console.error("Error submitting fields:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbee] p-4">
            <div className="flex flex-col w-full max-w-md border border-black p-4 sm:p-5 md:p-6 shadow-[2px_2px_0px_rgba(0,0,0,1)] justify-center bg-white">
                <h1 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4">Choose Your News Fields</h1>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4">
                    {["football", "it", 'politic', "cybersec", "crypto", "ai"].map((field) => (
                        <button
                            key={field}
                            onClick={() => handleFieldSelection(field)}
                            className={`border-black border-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] text-sm sm:text-base ${
                                selectedFields.includes(field) ? "bg-gray-300" : "bg-white"
                            }`}
                        >
                            {field}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 border border-black text-black font-semibold sm:font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] mx-auto"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FieldSection;
