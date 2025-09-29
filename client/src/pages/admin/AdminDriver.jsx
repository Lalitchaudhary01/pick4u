import React, { useEffect, useState } from "react";
import { approveDriver, blockDriver } from "../../api";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([
    { _id: "d1", name: "Driver 1", status: "PENDING" },
    { _id: "d2", name: "Driver 2", status: "APPROVED" },
  ]);

  const handleApprove = async (id) => {
    await approveDriver(id);
    alert("Driver approved");
  };

  const handleBlock = async (id) => {
    await blockDriver(id);
    alert("Driver blocked");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Drivers</h2>
      <ul className="space-y-3">
        {drivers.map((d) => (
          <li
            key={d._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              {d.name} ({d.status})
            </span>
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
