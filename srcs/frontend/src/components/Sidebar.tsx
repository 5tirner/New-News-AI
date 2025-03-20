import { useState, useEffect } from "react";
import { getCookie } from "../utils/getCoockie";
import { TbLayoutNavbarCollapseFilled } from "react-icons/tb";
import { TbLayoutNavbarExpandFilled } from "react-icons/tb";


const Sidebar = () => {
    let Access = getCookie("Access-Token");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);    
    const [isField, setField] = useState<string[]>([]);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("auth/api/getUserFields", {
              method: "GET", 
              headers: {
                "Content-Type": "application/json",
                "Access-Token": Access
              },
              credentials: "include", 
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const data = await response.json();
            const filteredFields  = Object.keys(data).filter(key => data[key] === true);
            if (!filteredFields) {
              console.warn("No 'fields' property found in the API response:", filteredFields);
              return;
            }
    
            setField(filteredFields);
            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      }, []);
    
    return (
        <div
            className={`${isSidebarOpen ? "w-64 bg-[#F5E6CF]" : "w-1 bg-[#fdfbee]"
            }  transition-all duration-300 p-4 flex flex-col`}
        >
    <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className=" text-white p-2 rounded text-right"
        >
        {isSidebarOpen ? <TbLayoutNavbarCollapseFilled style = {{transform: 'rotate(-90deg)' }} size={30} color="gray" /> : <TbLayoutNavbarExpandFilled style = {{transform: 'rotate(-90deg)' }} size={30} color="gray" />}
    </button>

    {isSidebarOpen && (
        <>
        <h2 className="font-bold mt-4">Fields</h2>
        <ul>
            {isField.map((field, index) => (
            <li key={index} className="mt-2">⚫ {field}</li>
        ))}
        </ul>
        <h2 className="font-bold mt-4">History</h2>
        <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
        <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
        <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
        </>
    )}
    </div>
);
}

export default Sidebar;