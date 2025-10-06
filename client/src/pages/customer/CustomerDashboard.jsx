import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    memberSince: "Jan 2024",
  });

  // Sample stats data
  const stats = [
    {
      label: "Active Orders",
      value: "3",
      icon: "📦",
      color: "bg-[#0500FF]",
      textColor: "text-[#0500FF]",
    },
    {
      label: "Completed",
      value: "47",
      icon: "✅",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
    },
    {
      label: "Total Spent",
      value: "₹12,450",
      icon: "💰",
      color: "bg-[#FFD426]",
      textColor: "text-[#FFD426]",
    },
    {
      label: "Wallet Balance",
      value: "₹850",
      icon: "💳",
      color: "bg-[#16C9FF]",
      textColor: "text-[#16C9FF]",
    },
  ];

  // Sample recent orders
  const recentOrders = [
    {
      id: "ORD-1234",
      pickup: "MG Road, Bangalore",
      dropoff: "Koramangala, Bangalore",
      status: "In Transit",
      statusColor: "bg-yellow-100 text-yellow-800",
      date: "Today, 2:30 PM",
      amount: "₹350",
    },
    {
      id: "ORD-1233",
      pickup: "Indiranagar",
      dropoff: "Whitefield",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
      date: "Yesterday",
      amount: "₹520",
    },
    {
      id: "ORD-1232",
      pickup: "HSR Layout",
      dropoff: "Electronic City",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
      date: "2 days ago",
      amount: "₹680",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Book New Order",
      icon: "🚚",
      color: "bg-[#0500FF]",
      action: () => navigate("/customer/book"),
    },
    {
      title: "Track Orders",
      icon: "📍",
      color: "bg-[#0D3483]",
      action: () => navigate("/customer/orders"),
    },
    {
      title: "Payment History",
      icon: "💳",
      color: "bg-[#FFD426]",
      action: () => navigate("/customer/payments"),
    },
    {
      title: "Support",
      icon: "💬",
      color: "bg-[#16C9FF]",
      action: () => navigate("/customer/support"),
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-200">
                Manage your deliveries, track orders, and explore Pick4U
                services
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Member Since</p>
              <p className="text-lg font-semibold">{user.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className={`${action.color} text-white rounded-xl p-6 hover:opacity-90 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3`}
              >
                <span className="text-4xl">{action.icon}</span>
                <span className="font-semibold text-sm">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
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
                  key={order.id}
                  className="border-2 border-gray-100 rounded-lg p-4 hover:border-[#0500FF] transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}
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
                          {order.pickup}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-1">📍</span>
                      <div>
                        <p className="text-xs text-gray-500">Drop-off</p>
                        <p className="text-sm font-medium text-gray-700">
                          {order.dropoff}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="text-lg font-bold text-[#0500FF]">
                      {order.amount}
                    </p>
                    <button className="text-[#0500FF] hover:bg-[#0500FF] hover:text-white px-4 py-2 rounded-lg font-semibold text-sm border-2 border-[#0500FF] transition-all">
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Profile & Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Profile</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0500FF] to-[#16C9FF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">Premium Member</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📧</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📱</span>
                  <span className="text-gray-600">{user.phone}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/customer/profile")}
                className="w-full mt-4 py-2 border-2 border-[#0500FF] text-[#0500FF] rounded-lg font-semibold hover:bg-[#0500FF] hover:text-white transition-all"
              >
                Edit Profile
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Notifications
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      New Offer!
                    </p>
                    <p className="text-xs text-gray-600">
                      Get 20% off on next booking
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Order Delivered
                    </p>
                    <p className="text-xs text-gray-600">
                      ORD-1233 completed successfully
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Order Update
                    </p>
                    <p className="text-xs text-gray-600">
                      Driver arriving in 10 mins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-br from-[#FFD426] to-[#FF6B35] rounded-xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-2">🎁 Refer & Earn</h3>
              <p className="text-sm mb-4 opacity-90">
                Invite friends and get ₹100 for each successful referral!
              </p>
              <button className="bg-white text-[#FF6B35] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all text-sm">
                Share Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
