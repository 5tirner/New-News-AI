import { Link } from "react-router-dom";
import  Notification  from "./Notification";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";

import { useLocation } from "react-router-dom"; // Import useLocation

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation(); // Get current location

  const isHome = location.pathname === "/home" || location.pathname === "/journalist";

  return (
    <nav className=" z-50 w-full top-0 left-0 bg-[#F5E6CF] p-4 border-b border-[#DDBD8A]">
      <div className="container flex justify-between text-white">
        <h1 className="text-xl font-bold text-black">Journalist</h1>
        
        {isHome ? (
          <>
            <div className="space-x-4">
              <Link to="/home" className="font-bold text-black">Home</Link>
            </div>
            <div className="icons space-x-4 flex">
              <Notification />
              {/* <CiLogout 
                size={30}
                color="gray"
                onClick={logout}
              /> */}
            </div>
          </>
        ) : (
          null
        )}
      </div>
    </nav>
  );
};

export default Navbar;