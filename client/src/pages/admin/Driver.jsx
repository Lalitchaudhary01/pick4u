import React, { useEffect, useState } from "react";
import { getAllDrivers, approveDriver, rejectDriver } from "../../api/adminApi";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDrivers() {
      const res = await getAllDrivers(token);
      setDrivers(res.data);
    }
    fetchDrivers();
  }, [token]);

  const handleApprove = async (id) => {
    await approveDriver(id, token);
    setDrivers(
      drivers.map((d) => (d._id === id ? { ...d, status: "approved" } : d))
    );
  };

  const handleReject = async (id) => {
    await rejectDriver(id, token);
    setDrivers(
      drivers.map((d) => (d._id === id ? { ...d, status: "rejected" } : d))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Drivers</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">KYC Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d._id}>
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.email}</td>
              <td className="p-2 border">{d.status}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleApprove(d._id)}
                  className="px-3 py-1 rounded bg-green-500 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(d._id)}
                  className="px-3 py-1 rounded bg-red-500 text-white"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
