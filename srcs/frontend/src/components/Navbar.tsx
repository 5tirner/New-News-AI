import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container flex justify-between text-white">
        <h1 className="text-xl font-bold">YourSport</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/teams" className="hover:underline">Teams</Link>
          <Link to="/tournaments" className="hover:underline">Tournaments</Link>
        </div>
        <div className="space-x-4">
          <Link to="/signup" className="hover:underline">Sign-up</Link>
          <Link to="/login" className="hover:underline">login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
