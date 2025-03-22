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
    <nav className="fixed z-[40] w-full top-0 left-0 bg-[#FFCC81] p-4 border-b border-[#DDBD8A]">
      <div className="container flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold text-black">Journalist</Link>
        
        {isHome ? (
          <>
            <div className="space-x-4">
              <Link to="/home" className="font-bold text-black hover:text-[#A0153E] transition-colors">Home</Link>
            </div>
            <div className="icons space-x-4 flex items-center">
              <Notification />
              {/* <CiLogout 
                size={30}
                color="#A0153E"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={logout}
              /> */}
            </div>
          </>
        ) : isChat ? (
          <>
            <div className="space-x-4">
              <Link to="/home" className="font-bold text-black hover:text-[#A0153E] transition-colors">Home</Link>
              <span className="text-[#A0153E] font-bold">Chat</span>
            </div>
            <div className="icons space-x-4 flex items-center">
              <Notification />
              <CiLogout 
                size={30}
                color="#A0153E"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={logout}
              />
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;