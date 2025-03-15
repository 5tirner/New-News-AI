import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#F5E6CF] p-4">
      <div className="container flex justify-between text-white">
        <h1 className="text-xl font-bold text-black">Journalist</h1>
        {/* <div className="space-x-4">
          <Link to="/signup" className="hover:underline text-black">Sign-up</Link>
          <Link to="/login" className="hover:underline text-black">login</Link>
        </div> */}
      </div>
    </nav>

  );
};

export default Navbar;
