import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-sky-600 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-bold tracking-wide">
        🚚 Pick4U
      </Link>

      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}

        {user?.role === "customer" && (
          <>
            <Link to="/customer/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/customer/book" className="hover:underline">
              Book Order
            </Link>
            <Link to="/customer/orders" className="hover:underline">
              My Orders
            </Link>
            <Link to="/customer/profile" className="hover:underline">
              Profile
            </Link>
          </>
        )}

        {user?.role === "driver" && (
          <>
            <Link to="/driver/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/driver/jobs" className="hover:underline">
              Jobs
            </Link>
            <Link to="/driver/earnings" className="hover:underline">
              Earnings
            </Link>
            <Link to="/driver/reports" className="hover:underline">
              Reports
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/admin/orders" className="hover:underline">
              Orders
            </Link>
            <Link to="/admin/drivers" className="hover:underline">
              Drivers
            </Link>
            <Link to="/admin/customers" className="hover:underline">
              Customers
            </Link>
            <Link to="/admin/reports" className="hover:underline">
              Reports
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
