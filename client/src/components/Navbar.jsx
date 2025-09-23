import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Example: check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // token remove
    setIsLoggedIn(false);
    navigate("/auth/register"); // redirect to login page
  };

  return (
    <nav className="bg-white shadow">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Pick4U
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/book" className="px-3 py-2 rounded hover:bg-indigo-50">
            Book Delivery
          </Link>
          <Link to="/track" className="px-3 py-2 rounded hover:bg-indigo-50">
            Track Order
          </Link>
          <Link to="/pricing" className="px-3 py-2 rounded hover:bg-indigo-50">
            Pricing
          </Link>
          <Link to="/contact" className="px-3 py-2 rounded hover:bg-indigo-50">
            Contact
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth/register"
              className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Login/Signup
            </Link>
          )}
        </div>

        {/* mobile menu button */}
        <div className="md:hidden">
          <MobileMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
}

// Mobile menu
function MobileMenu({ isLoggedIn, handleLogout }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer p-2 rounded hover:bg-gray-100">
        ☰
      </summary>
      <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded">
        <a href="/book" className="block px-4 py-2 hover:bg-gray-50">
          Book Delivery
        </a>
        <a href="/track" className="block px-4 py-2 hover:bg-gray-50">
          Track Order
        </a>
        <a href="/pricing" className="block px-4 py-2 hover:bg-gray-50">
          Pricing
        </a>
        <a href="/contact" className="block px-4 py-2 hover:bg-gray-50">
          Contact
        </a>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
          >
            Logout
          </button>
        ) : (
          <a href="/auth/register" className="block px-4 py-2 hover:bg-gray-50">
            Login/SignUp
          </a>
        )}
      </div>
    </details>
  );
}
