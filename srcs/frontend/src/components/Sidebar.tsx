import { useState, useEffect } from "react";
import { getCookie } from "../utils/getCoockie";
import { TbLayoutNavbarCollapseFilled } from "react-icons/tb";
import { TbLayoutNavbarExpandFilled } from "react-icons/tb";


const Sidebar = () => {
  let Access = getCookie("Access-Token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isField, setField] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]); // Added history state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user fields
        const fieldsResponse = await fetch("auth/api/getUserFields", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": Access
          },
          credentials: "include",
        });

        if (!fieldsResponse.ok) {
          throw new Error(`HTTP error! Status: ${fieldsResponse.status}`);
        }

        const fieldsData = await fieldsResponse.json();
        const filteredFields = Object.keys(fieldsData).filter(key => fieldsData[key] === true);
        setField(filteredFields);

        // Fetch history
        const historyResponse = await fetch("/ai/api/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": Access
          },
          credentials: "include",
        });

        if (!historyResponse.ok) {
          throw new Error(`HTTP error! Status: ${historyResponse.status}`);
        }

        const historyData = await historyResponse.json();
        // Extract titles from the nested structure
        const titles = Object.values(historyData).flatMap(conversation => 
          Object.values(conversation).map(item => item.title)
          
      );
        setHistory(titles);

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
        className="text-white p-2 rounded text-right"
      >
        {isSidebarOpen ?
          <TbLayoutNavbarCollapseFilled style={{ transform: 'rotate(-90deg)' }} size={30} color="gray" /> :
          <TbLayoutNavbarExpandFilled style={{ transform: 'rotate(-90deg)' }} size={30} color="gray" />}
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
          <div className="max-h-40 overflow-y-auto"> 
            <ul>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <li
                    key={index}
                    className="text-[10px] mt-3 text-center border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] h-8 w-full rounded flex items-center justify-center"
                  >
                    { item}
                  </li>
                ))
              ) : (
                <li className="mt-2 text-gray-500">No history available</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;