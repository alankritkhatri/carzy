import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, clearUserData } = useAuth();

  const handleLogout = () => {
    clearUserData();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar flex justify-between items-center p-4">
      <div className="logo">
        <Link to="/dashboard">
          <img src="/carzy_logo.png" className="w-30 h-16" alt="logo" />
        </Link>
      </div>

      <nav className="ml-auto flex gap-6">
        <a className="text-sm font-medium hover:text-blue-600" href="#">
          Features
        </a>
        <a className="text-sm font-medium hover:text-blue-600" href="#">
          Pricing
        </a>
        <a className="text-sm font-medium hover:text-blue-600" href="#">
          About
        </a>
        <a className="text-sm font-medium hover:text-blue-600" href="#">
          Contact
        </a>
      </nav>

      <div className="flex items-center gap-4 ml-6">
        {user.isAuthenticated ? (
          <>
            <div className="user-info">
              <h1 className="underline">{user.username}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
