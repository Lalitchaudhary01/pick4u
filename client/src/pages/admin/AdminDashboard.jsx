import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for development
  const dummyStats = {
    totalOrders: 1247,
    totalDrivers: 156,
    totalCustomers: 892,
    totalRevenue: 456780,
    activeOrders: 34,
    pendingDrivers: 8,
    todayRevenue: 12450,
    thisWeekRevenue: 89340,
  };

  const dummyRecentOrders = [
    {
      id: "ORD-8901",
      customer: "Priya Sharma",
      driver: "Rajesh Kumar",
      amount: 350,
      status: "delivered",
      date: "2 mins ago",
    },
    {
      id: "ORD-8900",
      customer: "Amit Patel",
      driver: "Suresh Singh",
      amount: 520,
      status: "in-transit",
      date: "15 mins ago",
    },
    {
      id: "ORD-8899",
      customer: "Neha Gupta",
      driver: "Vikram Rao",
      amount: 280,
      status: "assigned",
      date: "45 mins ago",
    },
    {
      id: "ORD-8898",
      customer: "Rohit Verma",
      driver: "Pending",
      amount: 450,
      status: "pending",
      date: "1 hour ago",
    },
  ];

  const dummyAlerts = [
    {
      type: "warning",
      icon: "⚠️",
      title: "Pending Driver Approvals",
      message: "8 drivers waiting for KYC approval",
      color: "bg-yellow-50",
    },
    {
      type: "info",
      icon: "📊",
      title: "High Demand Area",
      message: "Connaught Place needs more drivers",
      color: "bg-blue-50",
    },
    {
      type: "success",
      icon: "✅",
      title: "Daily Target Achieved",
      message: "Today's revenue goal reached!",
      color: "bg-green-50",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(dummyStats);
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() || "0",
      icon: "📦",
      color: "bg-[#0500FF]",
      textColor: "text-[#0500FF]",
      subtext: `${stats?.activeOrders || 0} active`,
    },
    {
      label: "Total Drivers",
      value: stats?.totalDrivers?.toLocaleString() || "0",
      icon: "🚗",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
      subtext: `${stats?.pendingDrivers || 0} pending approval`,
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers?.toLocaleString() || "0",
      icon: "👥",
      color: "bg-[#16C9FF]",
      textColor: "text-[#16C9FF]",
      subtext: "Active users",
    },
    {
      label: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || "0"}`,
      icon: "💰",
      color: "bg-[#FFD426]",
      textColor: "text-[#FFD426]",
      subtext: `₹${stats?.todayRevenue?.toLocaleString() || 0} today`,
    },
  ];

  const quickActions = [
    {
      title: "Manage Orders",
      icon: "📋",
      color: "bg-[#0500FF]",
      badge: 0,
    },
    {
      title: "Driver Approvals",
      icon: "✅",
      color: "bg-[#0D3483]",
      badge: stats?.pendingDrivers || 0,
    },
    {
      title: "All Drivers",
      icon: "🚗",
      color: "bg-[#FFD426]",
      badge: 0,
    },
    {
      title: "Customers",
      icon: "👥",
      color: "bg-[#16C9FF]",
      badge: 0,
    },
    {
      title: "Analytics",
      icon: "📊",
      color: "bg-purple-500",
      badge: 0,
    },
    {
      title: "Settings",
      icon: "⚙️",
      color: "bg-gray-600",
      badge: 0,
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      delivered: { bg: "bg-green-100", text: "text-green-800", icon: "✅" },
      "in-transit": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "🚚",
      },
      assigned: { bg: "bg-blue-100", text: "text-blue-800", icon: "📍" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
    };
    return (
      styles[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: "📦" }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-black to-blue-600 rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🎯</h1>
              <p className="text-gray-200">
                Monitor operations, manage users, and track platform performance
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Today's Date</p>
              <p className="text-lg font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, idx) => (
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
              <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className={`${action.color} text-white rounded-xl p-6 hover:opacity-90 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 relative`}
              >
                {action.badge > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
                <span className="text-4xl">{action.icon}</span>
                <span className="font-semibold text-sm text-center">
                  {action.title}
                </span>
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
              <button className="text-blue-600 hover:underline font-semibold text-sm">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {dummyRecentOrders.map((order) => {
                const statusStyle = getStatusStyle(order.status);
                return (
                  <div
                    key={order.id}
                    className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-600 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-800">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon} {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-sm font-medium text-gray-700">
                          {order.customer}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Driver</p>
                        <p className="text-sm font-medium text-gray-700">
                          {order.driver}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <p className="text-lg font-bold text-blue-600">
                        ₹{order.amount}
                      </p>
                      <button className="text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold text-sm border-2 border-blue-600 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Revenue Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Today</p>
                  <p className="text-2xl font-bold">
                    ₹{stats?.todayRevenue?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="border-t border-white border-opacity-20 pt-4">
                  <p className="text-sm opacity-90 mb-1">This Week</p>
                  <p className="text-2xl font-bold">
                    ₹{stats?.thisWeekRevenue?.toLocaleString() || "0"}
                  </p>
                </div>
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                  View Analytics
                </button>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                System Alerts
              </h2>
              <div className="space-y-3">
                {dummyAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 ${alert.color} rounded-lg cursor-pointer hover:opacity-80 transition-all`}
                  >
                    <span className="text-xl">{alert.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Platform Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Orders</span>
                  <span className="font-bold text-blue-600">
                    {stats?.activeOrders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Online Drivers</span>
                  <span className="font-bold text-green-600">
                    {Math.floor((stats?.totalDrivers || 0) * 0.6)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Response</span>
                  <span className="font-bold text-yellow-600">4.2 min</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
