import React, { useEffect, useState } from "react";
import {
  getPendingKycDrivers,
  approveDriver,
  rejectDriver,
} from "../../api/adminApi";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await getPendingKycDrivers();
      setDrivers(res.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      alert("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveDriver(id);
      alert("Driver approved");
      loadDrivers();
    } catch (err) {
      console.error("Error approving driver:", err);
      alert("Failed to approve driver");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectDriver(id);
      alert("Driver rejected");
      loadDrivers();
    } catch (err) {
      console.error("Error rejecting driver:", err);
      alert("Failed to reject driver");
    }
  };

  if (loading) return <p className="p-6">Loading drivers...</p>;
  if (drivers.length === 0)
    return <p className="p-6">No pending KYC requests.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        🚖 Pending Driver KYC Requests
      </h2>
      <ul className="space-y-4">
        {drivers.map((d) => (
          <li
            key={d._id}
            className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{d.user.name}</p>
              <p className="text-sm text-gray-500">Email: {d.user.email}</p>
              <p className="text-sm text-gray-500">KYC Status: {d.kycStatus}</p>
              {d.kycDocs?.length > 0 && (
                <p className="text-sm text-blue-500">
                  Documents: {d.kycDocs.join(", ")}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(d._id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(d._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
