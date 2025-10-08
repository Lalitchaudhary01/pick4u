import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext"; // ✅ add socket
import {
  getDriverProfile,
  getAssignedJobs,
  getEarnings,
  acceptJob,
  rejectJob,
} from "../../api";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const socket = useSocket();

  const [driver, setDriver] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy fallback data
  const dummyDriver = {
    name: "Rajesh Kumar",
    email: "rajesh.driver@pick4u.com",
    phone: "+91 98765 43210",
    vehicleNumber: "DL-01-AB-1234",
    kycStatus: "approved",
    createdAt: "2024-01-15",
    _id: "driver123", // needed for socket room
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
      _id: "job123458",
      pickupAddress: "Lajpat Nagar Market",
      dropAddress: "Greater Kailash, Delhi",
      packageWeight: 2,
      deliveryType: "same-day",
      fare: 150,
      status: "accepted",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
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

  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      setLoading(true);

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
        setDriver(dummyDriver);
        setJobs(dummyJobs);
        setEarnings(dummyEarnings);
      }
    } catch (err) {
      console.error(err);
      setDriver(dummyDriver);
      setJobs(dummyJobs);
      setEarnings(dummyEarnings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Socket Real-time ----------------
  useEffect(() => {
    if (!socket || !driver?._id) return;

    // Join driver-specific room
    socket.emit("join-driver", driver._id);

    // Listen for new assigned orders
    socket.on("new-assignment", (order) => {
      setJobs((prev) => [order, ...prev]);
      alert("📦 New job assigned!");
    });

    // Listen for KYC approval
    socket.on("kyc-approved", (driverData) => {
      setDriver(driverData);
      alert("✅ Your KYC has been approved!");
    });

    return () => {
      socket.off("new-assignment");
      socket.off("kyc-approved");
    };
  }, [socket, driver]);

  // ---------------- Job Actions ----------------
  const handleAcceptJob = async (jobId) => {
    try {
      await acceptJob(jobId);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "accepted" } : j))
      );
    } catch (err) {
      console.error(err);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "accepted" } : j))
      );
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await rejectJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

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
  const activeJobs = jobs.filter((j) =>
    ["accepted", "in-transit"].includes(j.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome, {driver?.name}!</h1>
        <p className="text-gray-200">
          Manage your jobs, track earnings, and update delivery status
        </p>
      </div>

      {/* Pending Jobs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          New Job Requests ({pendingJobs.length})
        </h2>
        {pendingJobs.length === 0 ? <p>No new jobs</p> : null}
        {pendingJobs.map((job) => {
          const statusStyle = getStatusStyle(job.status);
          return (
            <div key={job._id} className="border p-4 rounded-lg mb-3">
              <p className="font-bold">Order #{job._id.slice(-6)}</p>
              <p>Pickup: {job.pickupAddress}</p>
              <p>Drop: {job.dropAddress}</p>
              <p>Fare: ₹{job.fare}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAcceptJob(job._id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleRejectJob(job._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Jobs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          Active Deliveries ({activeJobs.length})
        </h2>
        {activeJobs.length === 0 ? <p>No active deliveries</p> : null}
        {activeJobs.map((job) => (
          <div key={job._id} className="border p-3 rounded-lg mb-3">
            <p>Order #{job._id.slice(-6)}</p>
            <p>Status: {job.status}</p>
            <button
              onClick={() => navigate(`/driver/jobs/${job._id}`)}
              className="text-blue-600 underline text-sm"
            >
              Update Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
