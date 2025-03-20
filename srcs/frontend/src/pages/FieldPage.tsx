
// import { useState } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FieldSection = () => {

    console.log("i am in field page (^_^)");
    
    const [selectedFields, setSelectedFields] = useState([]);
    const navigate = useNavigate();

    const handleFieldSelection = (field) => {
        setSelectedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field) // Remove if already selected
                : [...prevFields, field] // Add if not selected
        );
    };

    const handleSubmit = async () => {
        console.log("Fields :", JSON.stringify({ fields: selectedFields }))
        // navigate("/home");

        try {
            const response = await fetch("/auth/api/fields", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ fields: selectedFields })
            });
            if (response.ok) {
                console.log("Fields submitted successfully");
                navigate("/home");
            } else {
                console.error("Failed to submit fields");
            }
        } catch (error) {
            console.error("Error submitting fields:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbee]">
            <div className="flex flex-col w-100 h-80 border border-black p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)] justify-center bg-white">
                <h1 className="text-xl font-bold text-center">Choose Your News Fields</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                    {["football", "it",'politic', "cybersec", "crypto" , "ai"].map((field) => (
                        <button
                            key={field}
                            onClick={() => handleFieldSelection(field)}
                            className={`border-black border-2 px-4 py-2 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                                selectedFields.includes(field) ? "bg-gray-300" : "bg-white"
                            }`}
                        >
                            {field}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="mt-6 px-6 py-3 bg-gray-500 border border-black text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FieldSection;
