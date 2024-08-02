import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useLogoutMutation } from "../../services/authApi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [auth, setAuth] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout({}).unwrap();
      if (response?.success === true) {
        toast.success("Logout Successful", { autoClose: 2000 });
        Cookies.remove("is_Auth");
        setAuth(false); // Update auth state
        navigate("/");
      } else {
        toast.error("Error in logging out");
      }
    } catch (error) {
      toast.error("Error in logging out");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("is_Auth");
    setAuth(!!token); // Convert token to boolean
  }, [auth]); // Add auth as a dependency

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-around items-center">
        <div className="text-white text-lg font-bold">Navbar</div>
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          {auth ? (
            <>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                Logout
              </button>
              <Link to="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
