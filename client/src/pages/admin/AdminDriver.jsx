import React, { useEffect, useState } from "react";
import { getDrivers, approveDriver, blockDriver } from "../../api";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getDrivers();
    setDrivers(res.data);
  };

  const handleApprove = async (id) => {
    await approveDriver(id);
    alert("Driver approved");
    loadDrivers();
  };

  const handleBlock = async (id) => {
    await blockDriver(id);
    alert("Driver blocked");
    loadDrivers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚖 Manage Drivers</h2>
      <ul className="space-y-4">
        {drivers.map((d) => (
          <li
            key={d._id}
            className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{d.user.name}</p>
              <p className="text-sm text-gray-500">Email: {d.user.email}</p>
              <p className="text-sm text-gray-500">Status: {d.kycStatus}</p>
              <p
                className={`text-sm ${
                  d.availability ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {d.availability ? "Available" : "Unavailable"}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(d._id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleBlock(d._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Block
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
