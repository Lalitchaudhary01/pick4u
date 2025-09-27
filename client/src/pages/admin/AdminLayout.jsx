// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  ClipboardList,
  DollarSign,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">🚀 Startup Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="/admin/drivers"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <Truck size={18} /> Drivers
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <ClipboardList size={18} /> Orders
          </Link>
          <Link
            to="/admin/earnings"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <DollarSign size={18} /> Earnings
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          >
            <BarChart3 size={18} /> Reports
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
