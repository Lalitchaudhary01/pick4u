import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDriverProfile,
  getAssignedJobs,
  getEarnings,
  acceptJob,
  rejectJob,
} from "../../api";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for development
  const dummyDriver = {
    name: "Rajesh Kumar",
    email: "rajesh.driver@pick4u.com",
    phone: "+91 98765 43210",
    vehicleNumber: "DL-01-AB-1234",
    kycStatus: "approved",
    createdAt: "2024-01-15",
  };

  const dummyJobs = [
    {
      _id: "job123456",
      pickupAddress: "Connaught Place, New Delhi",
      dropAddress: "Karol Bagh, New Delhi",
      packageWeight: 5,
      deliveryType: "same-day",
      fare: 250,
      status: "assigned",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "job123457",
      pickupAddress: "Rajouri Garden, Delhi",
      dropAddress: "Dwarka Sector 10, Delhi",
      packageWeight: 3,
      deliveryType: "instant",
      fare: 180,
      status: "assigned",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "job123458",
      pickupAddress: "Lajpat Nagar Market",
      dropAddress: "Greater Kailash, Delhi",
      packageWeight: 2,
      deliveryType: "same-day",
      fare: 150,
      status: "accepted",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      _id: "job123459",
      pickupAddress: "Nehru Place, Delhi",
      dropAddress: "Noida Sector 62",
      packageWeight: 8,
      deliveryType: "instant",
      fare: 350,
      status: "in-transit",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  const dummyEarnings = {
    today: 1250,
    total: 45680,
    completedToday: 8,
    thisWeek: {
      count: 42,
      amount: 8950,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Try to fetch real data, fall back to dummy data
      try {
        const [profileRes, jobsRes, earningsRes] = await Promise.all([
          getDriverProfile(),
          getAssignedJobs(),
          getEarnings(),
        ]);

        setDriver(profileRes.data);
        setJobs(jobsRes.data || []);
        setEarnings(earningsRes.data);
      } catch (apiError) {
        console.log("Using dummy data for development:", apiError);
        // Use dummy data if API fails
        setDriver(dummyDriver);
        setJobs(dummyJobs);
        setEarnings(dummyEarnings);
      }
    } catch (err) {
      console.error("Error fetching driver dashboard data:", err);
      // Fallback to dummy data
      setDriver(dummyDriver);
      setJobs(dummyJobs);
      setEarnings(dummyEarnings);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await acceptJob(jobId);
      fetchData();
    } catch (err) {
      console.error("Error accepting job:", err);
      // Update dummy data locally
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "accepted" } : j))
      );
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await rejectJob(jobId);
      fetchData();
    } catch (err) {
      console.error("Error rejecting job:", err);
      // Remove from dummy data locally
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  const stats = [
    {
      label: "Today's Earnings",
      value: `₹${earnings?.today || 0}`,
      icon: "💰",
      color: "bg-[#0500FF]",
      textColor: "text-[#0500FF]",
    },
    {
      label: "Total Earnings",
      value: `₹${earnings?.total?.toLocaleString() || 0}`,
      icon: "💵",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
    },
    {
      label: "Active Jobs",
      value: jobs.filter((j) => j.status === "assigned").length.toString(),
      icon: "📦",
      color: "bg-[#FFD426]",
      textColor: "text-[#FFD426]",
    },
    {
      label: "Completed Today",
      value: earnings?.completedToday || 0,
      icon: "✅",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
    },
  ];

  const quickActions = [
    {
      title: "View All Jobs",
      icon: "📋",
      color: "bg-[#0500FF]",
      action: () => navigate("/driver/jobs"),
    },
    {
      title: "Earnings Report",
      icon: "💰",
      color: "bg-[#0D3483]",
      action: () => navigate("/driver/earnings"),
    },
    {
      title: "My Reports",
      icon: "📊",
      color: "bg-[#FFD426]",
      action: () => navigate("/driver/reports"),
    },
    {
      title: "Update Profile",
      icon: "👤",
      color: "bg-[#16C9FF]",
      action: () => navigate("/driver/profile"),
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      assigned: { bg: "bg-blue-100", text: "text-blue-800", icon: "🔵" },
      accepted: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      "in-transit": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "🚚",
      },
      delivered: { bg: "bg-green-100", text: "text-green-800", icon: "✅" },
    };
    return (
      styles[status.toLowerCase()] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
      }
    );
  };

  const pendingJobs = jobs.filter((j) => j.status === "assigned");
  const activeJobs = jobs.filter(
    (j) => j.status === "accepted" || j.status === "in-transit"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin mx-auto mb-4 text-[#0500FF]"
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
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {driver?.name || "Driver"}!
              </h1>
              <p className="text-gray-200">
                Manage your jobs, track earnings, and update delivery status
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  driver?.kycStatus === "approved"
                    ? "bg-green-500"
                    : driver?.kycStatus === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                <span className="text-2xl">
                  {driver?.kycStatus === "approved" ? "✅" : "⏳"}
                </span>
                <div className="text-left">
                  <p className="text-xs opacity-90">KYC Status</p>
                  <p className="font-bold capitalize">
                    {driver?.kycStatus || "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`text-4xl p-3 rounded-lg ${stat.color} bg-opacity-10`}
                >
                  {stat.icon}
                </div>
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
          {/* Pending Jobs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                New Job Requests
              </h2>
              <span className="px-3 py-1 bg-[#0500FF] text-white rounded-full text-sm font-semibold">
                {pendingJobs.length} Pending
              </span>
            </div>

            {pendingJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 mb-2">No pending job requests</p>
                <p className="text-sm text-gray-400">
                  New jobs will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingJobs.map((job) => {
                  const statusStyle = getStatusStyle(job.status);
                  return (
                    <div
                      key={job._id}
                      className="border-2 border-gray-100 rounded-lg p-4 hover:border-[#0500FF] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-800">
                            Order #{job._id?.slice(-6).toUpperCase() || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "Just now"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.icon} New Request
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-1">
                            📍
                          </span>
                          <div>
                            <p className="text-xs text-gray-500">Pickup</p>
                            <p className="text-sm font-medium text-gray-700">
                              {job.pickupAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-1">
                            📍
                          </span>
                          <div>
                            <p className="text-xs text-gray-500">Drop-off</p>
                            <p className="text-sm font-medium text-gray-700">
                              {job.dropAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            ⚖️ {job.packageWeight}kg
                          </span>
                          <span className="text-gray-600 capitalize">
                            🚀 {job.deliveryType}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#0500FF]">
                          ₹{job.fare}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptJob(job._id)}
                          className="flex-1 bg-[#0500FF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0400cc] transition-all"
                        >
                          Accept Job
                        </button>
                        <button
                          onClick={() => handleRejectJob(job._id)}
                          className="flex-1 border-2 border-red-500 text-red-500 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Driver Profile
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0500FF] to-[#16C9FF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {driver?.name?.charAt(0) || "D"}
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {driver?.name || "Driver"}
                  </p>
                  <p className="text-sm text-gray-500">Active Driver</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📧</span>
                  <span className="text-gray-600">
                    {driver?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📱</span>
                  <span className="text-gray-600">
                    {driver?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">🚗</span>
                  <span className="text-gray-600">
                    {driver?.vehicleNumber || "Not registered"}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Deliveries */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Active Deliveries
              </h3>
              {activeJobs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active deliveries
                </p>
              ) : (
                <div className="space-y-3">
                  {activeJobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        #{job._id?.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {job.pickupAddress?.substring(0, 30)}...
                      </p>
                      <button
                        onClick={() => navigate(`/driver/jobs/${job._id}`)}
                        className="text-xs text-[#0500FF] font-semibold hover:underline"
                      >
                        Update Status →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Earnings Summary */}
            <div className="bg-gradient-to-br from-[#0500FF] to-[#16C9FF] rounded-xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Deliveries</span>
                  <span className="font-bold text-lg">
                    {earnings?.thisWeek?.count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Earnings</span>
                  <span className="font-bold text-2xl">
                    ₹{earnings?.thisWeek?.amount?.toLocaleString() || 0}
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
