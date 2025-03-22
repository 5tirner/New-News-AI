import { Link } from "react-router-dom";
import Notification from "./Notification";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Check if current page is home or chat
  const isHome = location.pathname === "/home" || location.pathname === "/journalist";
  const isChat = location.pathname.includes("/chat") || location.pathname.includes("/journalist/");

  return (
    <nav className="fixed z-[40] w-full h-[10%] top-0 left-0 bg-gray-200 p-4 border-b-4 border-gray-400 shadow-md flex items-center justify-center">
      <div className="container flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold text-gray-800">Journalist</Link>
        
        {isHome ? (
          <>
            <div className="space-x-4">
              <Link 
                to="/home" 
                className="font-bold text-gray-800 px-4 py-2 border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-white 
                hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200"
              >
                Home
              </Link>
            </div>
            <div className="icons space-x-4 flex items-center">
              <div className="border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-gray-100 p-2">
                <Notification />
              </div>
              {/* <div className="border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-gray-800 p-2">
                <CiLogout 
                  size={24}
                  color="white"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={logout}
                />
              </div> */}
            </div>
          </>
        ) : isChat ? (
          <>
            <div className="space-x-4 flex items-center">
              <Link 
                to="/home" 
                className="font-bold text-gray-800 px-4 py-2 border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-gray-100
                hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-200"
              >
                Home
              </Link>
              <span className="font-bold text-gray-800 px-4 py-2 border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-white">
                Chat
              </span>
            </div>
            <div className="icons space-x-4 flex items-center">
              <div className="border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-gray-100 p-2">
                <Notification />
              </div>
              {/* <div className="border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-lg bg-gray-800 p-2">
                <CiLogout 
                  size={24}
                  color="white"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={logout}
                />
              </div> */}
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;