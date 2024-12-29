import { useState, useEffect } from "react";
import {
  FaTasks,
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-500 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold">tasks</div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {isAuthenticated && (
            <>
              <Link
                to="/task-list"
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <FaTasks />
                <span>Task List</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="flex items-center space-x-2 hover:text-gray-300"
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-600">
          <div className="flex flex-col space-y-2 p-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/task-list"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaTasks />
                  <span>Task List</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
