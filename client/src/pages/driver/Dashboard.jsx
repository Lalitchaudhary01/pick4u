import React, { useEffect, useState } from "react";
import {
  getAssignedJobs,
  acceptJob,
  declineJob,
  getDriverEarnings,
} from "../../api/driverApi";
import useSocket from "../../hooks/useSocket"; // ✅ default import

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const token = localStorage.getItem("driverToken");

  // Load jobs from API
  const loadJobs = async () => {
    try {
      const res = await getAssignedJobs(token);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load earnings from API
  const loadEarnings = async () => {
    try {
      const res = await getDriverEarnings(token);
      setEarnings(res.data.totalEarnings || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (orderId) => {
    await acceptJob(orderId, token);
    loadJobs();
    loadEarnings();
  };

  const handleDecline = async (orderId) => {
    await declineJob(orderId, token);
    loadJobs();
  };

  // Real-time socket updates
  useSocket("http://localhost:5000", (socket) => {
    socket.on("new-order", (data) => {
      alert("New order assigned!");
      loadJobs();
    });

    socket.on("order-updated", (data) => {
      setJobs((prev) =>
        prev.map((job) =>
          job._id === data._id ? { ...job, status: data.status } : job
        )
      );
    });
  });

  useEffect(() => {
    loadJobs();
    loadEarnings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <p className="mb-4 font-semibold">Total Earnings: ₹{earnings}</p>
      {jobs.length === 0 ? (
        <p>No assigned jobs currently.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Order ID:</strong> {job._id}
                </p>
                <p>
                  <strong>Pickup:</strong> {job.pickupAddress}
                </p>
                <p>
                  <strong>Drop:</strong> {job.dropAddress}
                </p>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
              </div>
              <div className="flex gap-2">
                {job.status === "Assigned" && (
                  <>
                    <button
                      onClick={() => handleAccept(job._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(job._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Decline
                    </button>
                  </>
                )}
                {job.status !== "Assigned" && (
                  <span className="text-blue-600 font-semibold">
                    {job.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
