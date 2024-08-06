import { Link } from "react-router-dom";
type RegisterProps = {
  onLogout: () => void;
  isLoggedIn: boolean;
};
const Navbar = ({ isLoggedIn, onLogout }: RegisterProps) => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-400">
            Home
          </Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/register" className="text-white hover:text-gray-400">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-gray-400">
                Login
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/profile" className="text-white hover:text-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="text-white hover:text-gray-400"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
