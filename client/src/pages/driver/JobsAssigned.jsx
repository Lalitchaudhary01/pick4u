import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";

export default function JobsAssigned() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const socket = useSocket();

  const API_BASE = "http://localhost:5000/api/driver"; // change this to your backend URL

  // ---------------- Fetch assigned jobs ----------------
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/orders/assigned`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Accept job ----------------
  const handleAccept = async (jobId) => {
    try {
      await fetch(`${API_BASE}/orders/${jobId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchJobs(); // refresh list
    } catch (err) {
      console.error("Error accepting job:", err);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "accepted" } : j))
      );
    }
  };

  // ---------------- Reject job ----------------
  const handleReject = async (jobId) => {
    try {
      await fetch(`${API_BASE}/orders/${jobId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchJobs();
    } catch (err) {
      console.error("Error rejecting job:", err);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  // ---------------- Socket listeners ----------------
  useEffect(() => {
    fetchJobs();

    if (socket) {
      socket.on("new-order", (order) => {
        // Only add if status is pending/assigned to this driver
        if (!jobs.find((j) => j._id === order._id)) {
          setJobs((prev) => [...prev, order]);
        }
      });

      socket.on("order-updated", (updatedOrder) => {
        setJobs((prev) =>
          prev.map((j) => (j._id === updatedOrder._id ? updatedOrder : j))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("new-order");
        socket.off("order-updated");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // ---------------- Helpers ----------------
  const getStatusStyle = (status) => {
    const styles = {
      assigned: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "🔵",
        label: "New",
      },
      accepted: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳",
        label: "Accepted",
      },
      "in-transit": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "🚚",
        label: "In Transit",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✅",
        label: "Delivered",
      },
    };
    return (
      styles[status.toLowerCase()] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
        label: status,
      }
    );
  };

  const filterTabs = [
    { value: "all", label: "All Jobs", count: jobs.length },
    {
      value: "assigned",
      label: "New Requests",
      count: jobs.filter((j) => j.status === "assigned").length,
    },
    {
      value: "accepted",
      label: "Accepted",
      count: jobs.filter((j) => j.status === "accepted").length,
    },
    {
      value: "in-transit",
      label: "In Transit",
      count: jobs.filter((j) => j.status === "in-transit").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: jobs.filter((j) => j.status === "delivered").length,
    },
  ];

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  filter === tab.value
                    ? "bg-[#0500FF] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.value
                      ? "bg-white text-[#0500FF]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "Jobs will appear here when assigned"
                : `You don't have any ${filter} jobs at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const statusStyle = getStatusStyle(job.status);
              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-[#0500FF]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Order #{job._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.icon} {statusStyle.label}
                    </span>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Pickup Location
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {job.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Drop Location
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {job.dropAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {job.status === "assigned" && (
                      <>
                        <button
                          onClick={() => handleAccept(job._id)}
                          className="flex-1 bg-[#0500FF] text-white py-3 rounded-lg font-semibold hover:bg-[#0400cc] transition-all shadow-md"
                        >
                          Accept Job
                        </button>
                        <button
                          onClick={() => handleReject(job._id)}
                          className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(job.status === "accepted" ||
                      job.status === "in-transit") && (
                      <Link
                        to={`/driver/jobs/${job._id}`}
                        className="flex-1 bg-[#0500FF] text-white py-3 rounded-lg font-semibold hover:bg-[#0400cc] transition-all text-center shadow-md"
                      >
                        Update Status
                      </Link>
                    )}
                    {job.status === "delivered" && (
                      <button
                        disabled
                        className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✅ Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
