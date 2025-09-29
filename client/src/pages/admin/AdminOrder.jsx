import React, { useEffect, useState } from "react";
import { getAllOrders, assignDriver, cancelOrder } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then((res) => setOrders(res.data));
  }, []);

  const handleAssign = async (id) => {
    const driverId = prompt("Enter Driver ID to assign:");
    if (driverId) {
      await assignDriver(id, { driverId });
      alert("Driver assigned");
    }
  };

  const handleCancel = async (id) => {
    await cancelOrder(id);
    alert("Order cancelled");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o._id} className="border p-3 rounded flex justify-between">
            <span>
              {o.pickupAddress} → {o.dropAddress} ({o.status})
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleAssign(o._id)}
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Assign
              </button>
              <button
                onClick={() => handleCancel(o._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
