import React, { useEffect, useState } from "react";
import { getAllOrders, assignDriver, cancelAdminOrder } from "../../api";
import { useSocket } from "../../contexts/SocketContext";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    loadOrders();

    if (socket) {
      socket.on("order-status", (data) => {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === data.orderId ? { ...o, status: data.status } : o
          )
        );
      });
    }

    return () => {
      if (socket) socket.off("order-status");
    };
  }, [socket, refresh]);

  const loadOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.data);
  };

  const handleAssign = async (id) => {
    const driverId = prompt("Enter Driver ID to assign:");
    if (driverId) {
      await assignDriver(id, { driverId });
      alert("Driver assigned successfully!");
      setRefresh(!refresh);
    }
  };

  const handleCancel = async (id) => {
    await cancelAdminOrder(id);
    alert("Order cancelled!");
    setRefresh(!refresh);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Manage Orders</h2>
      <ul className="space-y-4">
        {orders.map((o) => (
          <li
            key={o._id}
            className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {o.pickupAddress} → {o.dropAddress}
              </p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-semibold">{o.status}</span>
              </p>
              <p className="text-sm text-gray-500">Fare: ₹{o.fare}</p>
              {o.assignedDriver && (
                <p className="text-sm text-emerald-600">
                  Driver Assigned: {o.assignedDriver.name}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleAssign(o._id)}
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Assign Driver
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
