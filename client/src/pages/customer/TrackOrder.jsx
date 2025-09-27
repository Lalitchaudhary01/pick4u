// src/components/OrderTracker.jsx
import React, { useEffect, useState } from "react";
import { getOrderById } from "../../api/orderApi";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend socket

export default function OrderTracker({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();

    // Listen for status updates in real-time
    socket.on(`order-status-${orderId}`, (statusUpdate) => {
      setOrder((prev) => ({ ...prev, status: statusUpdate.status }));
    });

    return () => {
      socket.off(`order-status-${orderId}`);
    };
  }, [orderId]);

  if (!order) return <p>Loading order...</p>;

  const statusFlow = [
    "pending",
    "assigned",
    "accepted",
    "picked-up",
    "in-transit",
    "delivered",
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Tracker</h1>
      <p className="mb-4">Order ID: {order._id}</p>
      <div className="space-y-2">
        {statusFlow.map((status) => (
          <div key={status} className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full ${
                statusFlow.indexOf(order.status) >= statusFlow.indexOf(status)
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            ></div>
            <span className="capitalize">{status.replace("-", " ")}</span>
          </div>
        ))}
      </div>
      {order.assignedDriver && (
        <p className="mt-4">
          Driver: {order.assignedDriver.name} ({order.assignedDriver.phone})
        </p>
      )}
    </div>
  );
}
