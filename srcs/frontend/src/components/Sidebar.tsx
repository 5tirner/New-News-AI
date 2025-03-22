import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/getCoockie";
import { TbLayoutNavbarCollapseFilled, TbLayoutNavbarExpandFilled } from "react-icons/tb";
import { IoLogOut } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import Notification from "./Notification";

const NavbarWithSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  let Access = getCookie("Access-Token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isField, setField] = useState<string[]>([]);
  const [history, setHistory] = useState<{ title: string, id: string }[]>([]);
  const [activeSection, setActiveSection] = useState<'fields' | 'history' | null>('fields');
  
  const isHome = location.pathname === "/home" || location.pathname === "/journalist";

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
  }, []);

  const handleHistoryClick = (conversationId) => {
    navigate(`/Journalist/${conversationId}`, {
      state: { newsItem: { id: conversationId } },
    });
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Combined content for both components
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FFCC81] p-3 md:p-4 border-b border-[#DDBD8A] z-40 flex items-center">
        <div className="container mx-auto flex justify-between items-center text-white">
          {/* Sidebar toggle button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-white mr-3"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <TbLayoutNavbarCollapseFilled size={24} color="#A0153E" />
            ) : (
              <TbLayoutNavbarExpandFilled size={24} color="#A0153E" />
            )}
          </button>
          
          <Link to="/home" className="text-xl font-bold text-black">Journalist</Link>
          
          {isHome && (
            <>
              <div className="hidden md:block space-x-4">
                <Link to="/home" className="font-bold text-black">Home</Link>
              </div>
              <div className="icons space-x-4 flex items-center">
                <Notification />
                <button onClick={logout} className="hidden md:flex items-center">
                  <IoLogOut size={24} color="#A0153E" />
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Sidebar - Positioned below navbar on mobile, beside navbar on desktop */}
      <div 
        className={`
          fixed z-30 bg-[#FFCC81] transition-all duration-300 shadow-md
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          top-0 left-0 h-full pt-16 md:pt-20
          md:w-16 ${isSidebarOpen ? "w-64" : "w-0"}
          md:block
        `}
      >
        {/* Main navigation buttons */}
        <div className="flex flex-col h-full">
          {/* Fields button */}
          <button 
            onClick={() => setActiveSection('fields')}
            className={`flex items-center px-4 py-3 ${activeSection === 'fields' ? 'bg-[#ffbb5c]' : 'hover:bg-[#ffbb5c]'} transition-colors`}
          >
            <MdCategory size={24} color="#A0153E" />
            <span className="ml-3 md:hidden font-medium">Fields</span>
          </button>
          
          {/* History button */}
          <button 
            onClick={() => setActiveSection('history')}
            className={`flex items-center px-4 py-3 ${activeSection === 'history' ? 'bg-[#ffbb5c]' : 'hover:bg-[#ffbb5c]'} transition-colors`}
          >
            <BiHistory size={24} color="#A0153E" />
            <span className="ml-3 md:hidden font-medium">History</span>
          </button>

          {/* Content section based on active section - visible only when sidebar is expanded */}
          <div className={`flex-grow p-4 overflow-y-auto ${!isSidebarOpen && 'hidden md:hidden'}`}>
            {activeSection === 'fields' && (
              <div>
                <h2 className="font-bold border-b border-[#A0153E] pb-2 mb-3">Your Fields</h2>
                <ul className="space-y-2">
                  {isField.length > 0 ? (
                    isField.map((field, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-[#A0153E] rounded-full mr-2"></span>
                        <span className="capitalize">{field}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No fields selected</li>
                  )}
                </ul>
              </div>
            )}

            {activeSection === 'history' && (
              <div>
                <h2 className="font-bold border-b border-[#A0153E] pb-2 mb-3">Chat History</h2>
                <ul className="space-y-2">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleHistoryClick(item.id)}
                        className="py-2 px-2 rounded cursor-pointer hover:bg-[#ffbb5c] transition-colors text-sm truncate"
                      >
                        {item.title}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No history available</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Logout button at the bottom - visible on mobile only */}
          <div className="p-4 mt-auto md:hidden">
            <button 
              onClick={logout}
              className="flex items-center w-full px-2 py-2 rounded hover:bg-[#ffbb5c] transition-colors"
            >
              <IoLogOut size={24} color="#A0153E" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded sidebar overlay - mobile only */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content spacer to prevent content from being hidden under fixed navbar and sidebar */}
      <div className="md:ml-16 pt-14 md:pt-16"></div>
    </>
  );
};

export default NavbarWithSidebar;