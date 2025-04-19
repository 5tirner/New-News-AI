import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import { TbLayoutNavbarCollapseFilled, TbLayoutNavbarExpandFilled } from "react-icons/tb";
import { IoLogOut } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onFieldSelect }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const Access = getCookie("Access-Token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isField, setField] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('fields');
  const [activeField, setActiveField] = useState("All News");

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
        const historyItems = Object.entries(historyData).map(([convId, convData]) => ({
          id: convId,
          title: convData.title,
        }));
        
        setHistory(historyItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [Access]);

  const handleHistoryClick = (conversationId) => {
    navigate(`/Journalist/${conversationId}`, {
      state: { newsItem: { id: conversationId } },
    });
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleFieldClick = (field) => {
    setActiveField(field);
    onFieldSelect(field); // Pass the selected field to the parent component
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Close sidebar on mobile
    }
  };

  return (
    <>
      {/* Sidebar - positioned below navbar */}
      <div 
        className={`
          fixed z-30 bg-gray-200 transition-all duration-300 shadow-md border-r-4 border-gray-400
          ${isSidebarOpen ? "w-64 sm:w-72" : "w-16"}
          top-16 left-0 h-[calc(100vh-64px)] // Dynamically adjust height based on Navbar height
          flex flex-col overflow-hidden
        `}
      >
        {/* Toggle button */}
        <div className="p-3 flex justify-end">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-gray-300 transition-colors border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] w-10 h-10 flex items-center justify-center"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <TbLayoutNavbarCollapseFilled style={{ transform: 'rotate(-90deg)'}} size={20} className="text-gray-800" />
            ) : (
              <TbLayoutNavbarExpandFilled style={{ transform: 'rotate(-90deg)' }} size={20} className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Content container */}
        <div className="flex flex-col flex-grow px-2 mt-2 overflow-y-auto">
          {/* Navigation buttons */}
          <div className="flex-shrink-0">
            {/* Fields button */}
            <button 
              onClick={() => setActiveSection('fields')}
              className={`
                flex items-center ${isSidebarOpen ? "px-4" : "justify-center"} py-3 mb-2
                border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]
                rounded-lg transition-all duration-200 w-full
                ${activeSection === 'fields' ? 'bg-white' : 'bg-gray-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]'}
              `}
            >
              <div className="flex items-center justify-center min-w-[20px]">
                <MdCategory size={20} className="text-gray-800" />
              </div>
              {isSidebarOpen && <span className="ml-3 font-bold uppercase text-gray-800">Fields</span>}
            </button>
            
            {/* History button */}
            <button 
              onClick={() => setActiveSection('history')}
              className={`
                flex items-center ${isSidebarOpen ? "px-4" : "justify-center"} py-3 mb-2
                border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]
                rounded-lg transition-all duration-200 w-full
                ${activeSection === 'history' ? 'bg-white' : 'bg-gray-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]'}
              `}
            >
              <div className="flex items-center justify-center min-w-[20px]">
                <BiHistory size={20} className="text-gray-800" />
              </div>
              {isSidebarOpen && <span className="ml-3 font-bold uppercase text-gray-800">History</span>}
            </button>
          </div>

          {/* Content section */}
          {isSidebarOpen && (
            <div className="h-full mt-2 border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-white flex flex-col overflow-y-auto">
              {activeSection === 'fields' && (
                <div className="flex flex-col h-full">
                  <h2 className="font-bold text-sm sm:text-base border-b-4 border-gray-400 pb-2 px-4 pt-4 mb-2 uppercase text-gray-800 flex-shrink-0">Your Fields</h2>
                  <div className="overflow-y-auto px-4 flex-grow">
                    <ul className="space-y-2">
                      <li
                        className={`cursor-pointer py-2 px-4 rounded-lg ${
                          activeField === "All News" ? "bg-gray-300" : "hover:bg-gray-200"
                        }`}
                        onClick={() => handleFieldClick("All News")}
                      >
                        All News
                      </li>
                      {isField.length > 0 ? (
                        isField.map((field, index) => (
                          <li
                            key={index}
                            className={`cursor-pointer py-2 px-4 rounded-lg ${
                              activeField === field ? "bg-gray-300" : "hover:bg-gray-200"
                            }`}
                            onClick={() => handleFieldClick(field)}
                          >
                            {field}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm py-1">No fields selected</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'history' && (
                <div className="flex flex-col h-full">
                  <h2 className="font-bold text-sm sm:text-base border-b-4 border-gray-400 pb-2 px-4 pt-4 mb-2 uppercase text-gray-800 flex-shrink-0">Chat History</h2>
                  <div className="overflow-y-auto px-4 flex-grow">
                    <ul className="space-y-1">
                      {history.length > 0 ? (
                        history.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => handleHistoryClick(item.id)}
                            className="py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-sm truncate border-2 border-gray-300 mb-2 font-medium"
                            title={item.title}
                          >
                            {item.title}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm py-1">No history available</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout button */}
        <div className="p-4 mt-auto flex-shrink-0">
          <button 
            onClick={logout}
            className={`flex items-center w-full ${isSidebarOpen ? "justify-start px-4" : "justify-center px-2"} py-3 
                     border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] 
                     rounded-lg bg-gray-800 text-white hover:bg-gray-700
                     transition-all duration-200 hover:translate-x-1 hover:translate-y-1 
                     hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]`}
          >
            <div className="flex items-center justify-center min-w-[20px]">
              <IoLogOut size={20} />
            </div>
            {isSidebarOpen && <span className="ml-3 font-bold uppercase">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;