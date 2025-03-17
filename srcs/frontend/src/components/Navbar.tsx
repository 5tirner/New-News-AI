import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className="bg-[#F5E6CF] p-4 border-b border-[#DDBD8A]">
      <div className="container flex justify-between text-white">
        <h1 className="text-xl font-bold text-black">Journalist</h1>
        <div className="space-x-4">
          <Link to="/home" className="font-bold text-black">Home</Link>
        </div>
        <div className="space-x-4 flex ">
        <IoIosNotifications size={30} color="red"/>
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-black"></span>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
