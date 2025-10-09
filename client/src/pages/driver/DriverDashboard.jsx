import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const socket = useSocket();

  const [driver, setDriver] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Driver data and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // Driver profile
        const profileRes = await axios.get("/api/driver/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriver(profileRes.data);

        // Assigned jobs
        const jobsRes = await axios.get("/api/driver/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);

        setLoading(false);
      } catch (err) {
        console.error("Driver dashboard fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ---------------- Socket Real-time ----------------
  useEffect(() => {
    if (!socket || !driver?._id) return;
    socket.emit("join-driver", driver._id);

    socket.on("new-order", (order) => {
      setJobs((prev) => [order, ...prev]);
      alert("📦 New order received!");
    });

    return () => socket.off("new-order");
  }, [socket, driver]);

  // ---------------- Job Actions ----------------
  const handleAcceptJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/api/driver/jobs/${jobId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "assigned" } : j))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/api/driver/jobs/${jobId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  // Categorize jobs
  const pendingJobs = jobs.filter(
    (j) => j.status === "pending" || j.status === "assigned"
  );
  const activeJobs = jobs.filter((j) =>
    ["assigned", "in-transit"].includes(j.status)
  );
  const completedJobs = jobs.filter((j) => j.status === "delivered");
  const recentJobs = jobs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Stats
  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs.length,
      icon: "📦",
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      label: "Pending Jobs",
      value: pendingJobs.length,
      icon: "⏳",
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      label: "Completed Jobs",
      value: completedJobs.length,
      icon: "✅",
      color: "bg-green-100",
      textColor: "text-green-800",
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
        <div className="bg-gradient-to-r from-black to-blue-700 rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {driver?.user?.name || driver.name} 👋
              </h1>
              <p className="text-gray-200">
                Manage your deliveries, track jobs, and update status
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Member Since</p>
              <p className="text-lg font-semibold">
                {driver?.createdAt
                  ? new Date(driver.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl p-3 rounded-lg ${stat.color}`}>
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

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
            <button
              onClick={() => navigate("/driver/jobs")}
              className="text-blue-700 hover:underline font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job._id}
                className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-700 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">
                      #{job._id.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : job.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium text-gray-700">
                        {job.pickupAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Drop-off</p>
                      <p className="text-sm font-medium text-gray-700">
                        {job.dropAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-blue-700">
                    ₹{job.fare || "N/A"}
                  </p>
                  <button
                    onClick={() => navigate(`/driver/jobs/${job._id}`)}
                    className="text-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg font-semibold text-sm border-2 border-blue-700 transition-all"
                  >
                    Update Status
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
