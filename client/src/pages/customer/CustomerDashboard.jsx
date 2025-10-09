import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // Fetch user profile
        const userRes = await axios.get("/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch all orders
        const ordersRes = await axios.get("/api/customer/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersArray = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        setOrders(ordersArray);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Categorize orders
  const activeOrders = orders.filter((o) =>
    ["pending", "assigned", "accepted", "picked", "in-transit"].includes(
      o.status.toLowerCase()
    )
  );
  const completedOrders = orders.filter((o) =>
    ["delivered"].includes(o.status.toLowerCase())
  );
  const recentOrders = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Dashboard stats (Active Orders = total orders)
  const stats = [
    {
      label: "Active Orders",
      value: orders.length, // total orders
      icon: "📦",
      color: "bg-[#0500FF]",
      textColor: "text-[#0500FF]",
    },
    {
      label: "Completed Orders",
      value: completedOrders.length,
      icon: "✅",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
    },
    {
      label: "Total Spent",
      value: `₹${orders.reduce((sum, o) => sum + (o.fare || 0), 0)}`,
      icon: "💰",
      color: "bg-[#FFD426]",
      textColor: "text-[#FFD426]",
    },
    {
      label: "Wallet Balance",
      value: "₹850", // replace with API if available
      icon: "💳",
      color: "bg-[#16C9FF]",
      textColor: "text-[#16C9FF]",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name || "Customer"}! 👋
              </h1>
              <p className="text-gray-200">
                Manage your deliveries, track orders, and explore services
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Member Since</p>
              <p className="text-lg font-semibold">
                {user.memberSince || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`text-4xl p-3 rounded-lg ${stat.color} bg-opacity-10`}
                >
                  {stat.icon}
                </div>
                <svg
                  className={`w-6 h-6 ${stat.textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button
              onClick={() => navigate("/customer/orders")}
              className="text-[#0500FF] hover:underline font-semibold text-sm"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="border-2 border-gray-100 rounded-lg p-4 hover:border-[#0500FF] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">#{order._id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium text-gray-700">
                        {order.pickupAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Drop-off</p>
                      <p className="text-sm font-medium text-gray-700">
                        {order.dropAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-[#0500FF]">
                    ₹{order.fare || "N/A"}
                  </p>
                  <button className="text-[#0500FF] hover:bg-[#0500FF] hover:text-white px-4 py-2 rounded-lg font-semibold text-sm border-2 border-[#0500FF] transition-all">
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
