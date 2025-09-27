// src/components/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import { getAssignedJobs, acceptJob, declineJob } from "../../api/driverApi";
import { io } from "socket.io-client";
import { CheckCircle, XCircle } from "lucide-react";

const socket = io("http://localhost:5000"); // change if different

export default function DriverDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch assigned jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAssignedJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Listen to new orders in real-time
    socket.on("new-order", (order) => {
      setJobs((prev) => [order, ...prev]);
      alert(`New Order Assigned: ${order.orderId}`);
    });

    return () => {
      socket.off("new-order");
    };
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await acceptJob(id);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === id ? { ...job, status: "accepted" } : job
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id) => {
    setActionLoading(id);
    try {
      await declineJob(id);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === id ? { ...job, status: "rejected" } : job
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
      {loading ? (
        <p>Loading assigned jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No assigned jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Order ID: {job._id}
                </p>
                <p className="text-gray-600">
                  Pickup: {job.pickupAddress} → Drop: {job.dropAddress}
                </p>
                <p className="text-gray-600">Weight: {job.packageWeight} kg</p>
                <p className="text-gray-600">Status: {job.status}</p>
              </div>
              <div className="flex space-x-2">
                {job.status === "assigned" && (
                  <>
                    <button
                      onClick={() => handleAccept(job._id)}
                      disabled={actionLoading === job._id}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(job._id)}
                      disabled={actionLoading === job._id}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </>
                )}
                {job.status !== "assigned" && (
                  <span
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      job.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
