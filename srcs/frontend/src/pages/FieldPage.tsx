import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";

const FieldSection = () => {
    let Access = getCookie("Access-Token");
    const [selectedFields, setSelectedFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center p-4">
            <main className="flex flex-col items-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800">Select Your Interests</h1>
                
                <div className="mt-3 bg-white p-4 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
                    <div className="mb-4 text-left">
                        <p className="text-gray-700">Choose the news topics you're interested in following:</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {["football", "it", 'politic', "cybersec", "crypto", "ai"].map((field) => (
                            <button
                                key={field}
                                onClick={() => handleFieldSelection(field)}
                                className={`p-3 rounded-lg border-4 border-gray-800 flex items-center justify-center font-medium transition-all duration-200 
                                ${selectedFields.includes(field) 
                                    ? "bg-gray-800 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] translate-x-1 translate-y-1" 
                                    : "bg-white text-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]"
                                }`}
                            >
                                {selectedFields.includes(field) && <FaCheckCircle className="mr-2" />}
                                <span className="capitalize">{field}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || selectedFields.length === 0}
                        className={`w-full flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200 font-bold mt-6 ${
                            (isLoading || selectedFields.length === 0) ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FaPaperPlane className="mr-2" />
                        )}
                        {isLoading ? "Submitting..." : "Save Preferences"}
                    </button>
                </div>
                
                <div className="mt-3 bg-gray-100 p-3 rounded-lg border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] w-full">
                    <p className="text-sm text-gray-700">
                        You can always change your preferences later from your profile settings.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default FieldSection;