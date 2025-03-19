import { Link } from "react-router-dom";
import  Notification  from "./Notification";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { logout } = useAuth();

  return (
    <nav className="static top-0 left-0 bg-[#F5E6CF] p-4 border-b border-[#DDBD8A]">
      <div className="container flex justify-between text-white">
        <h1 className="text-xl font-bold text-black">Journalist</h1>
        <div className="space-x-4">
          <Link to="/home" className="font-bold text-black">Home</Link>
        </div>
        <div className="icons space-x-4 flex">
          <Notification />
          <CiLogout 
            size={30}
            color="gray"
            onClick={logout}
            />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
