import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import { useAuth } from "../context/AuthContext";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="flex flex-col w-full max-w-md p-4 sm:p-5 md:p-6 justify-center bg-[#FFCC81] rounded shadow-md">
                <h1 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4 text-[#A0153E] border-b border-[#A0153E] pb-2">Choose Your News Fields</h1>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4">
                    {["football", "it", 'politic', "cybersec", "crypto", "ai"].map((field) => (
                        <button
                            key={field}
                            onClick={() => handleFieldSelection(field)}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-colors ${
                                selectedFields.includes(field) ? "bg-[#ffbb5c]" : "bg-white hover:bg-[#ffbb5c]"
                            }`}
                        >
                            <span className={selectedFields.includes(field) ? "text-[#A0153E] font-medium" : ""}>
                                {field}
                            </span>
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-[#ffbb5c] text-[#A0153E] font-semibold sm:font-bold rounded transition-colors mx-auto flex items-center"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FieldSection;