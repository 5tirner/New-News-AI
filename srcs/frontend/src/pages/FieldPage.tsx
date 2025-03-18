
// import { useState } from "react";
import { useNavigate } from "react-router-dom";


const FieldSection = () => {

    const navigate = useNavigate();

    const handleFieldSelection = (field) => {
        // if (!isField.includes(field)) {
        //     setField(field);
        //     console.log('chose your filed' + field);
        // }
        navigate('/home')
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbee]">
            <div className="flex flex-col w-100 h-80 border border-black p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)] justify-center bg-white">
                <h1 className="text-xl font-bold text-center">Choose Your News Fields</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                    <button onClick={() => handleFieldSelection("Football")} className="border-black border-2 px-4 py-2 rounded-full bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        Football
                    </button>
                    <button onClick={() => handleFieldSelection("Web Dev")} className="border-black border-2 px-4 py-2 rounded-full bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        Web Dev
                    </button>
                    <button onClick={() => handleFieldSelection("Technology")} className="border-black border-2 px-4 py-2 rounded-full bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        Technology
                    </button>
                    <button onClick={() => handleFieldSelection("Business")} className="border-black border-2 px-4 py-2 rounded-full bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        Business
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FieldSection;