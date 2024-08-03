import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-around items-center">
      <Link to={"/"} className="text-white text-lg">Navbar</Link>
      <div>
        <Link to={"/login"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
        >
          Login
        </Link>
        <Link to={"/register"} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </Link>
        {/* <button 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-2"
        >
          Logout
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
