// src/components/driver/DriverOrders.jsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";

export default function DriverOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // Helper: get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch pending orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/driver/orders/pending",
        { headers: getAuthHeaders() }
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []); // ensure array
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  // Accept order
  const handleAccept = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/driver/orders/${orderId}/accept`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  // Reject order
  const handleReject = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/driver/orders/${orderId}/reject`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } catch (err) {
      console.error("Error rejecting order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      // New order pushed via socket
      socket.on("new-order", (order) => {
        setOrders((prev) => [...prev, order]);
      });

      // Order assigned to another driver
      socket.on("order-assigned", (order) => {
        setOrders((prev) => prev.filter((o) => o._id !== order._id));
      });

      // Order status updated
      socket.on("order-updated", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("new-order");
        socket.off("order-assigned");
        socket.off("order-updated");
      }
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">🚚 Incoming Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No new orders available.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o._id}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center border"
            >
              <div>
                <p className="font-medium">
                  {o.pickupAddress} → {o.dropAddress}
                </p>
                <p className="text-sm text-gray-500">Fare: ₹{o.fare}</p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      o.status === "assigned"
                        ? "text-blue-600"
                        : o.status === "accepted"
                        ? "text-yellow-600"
                        : o.status === "in-transit"
                        ? "text-purple-600"
                        : "text-green-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                {o.status === "assigned" && (
                  <>
                    <button
                      onClick={() => handleAccept(o._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(o._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
                {(o.status === "accepted" || o.status === "in-transit") && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                    In Progress
                  </span>
                )}
                {o.status === "delivered" && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    Delivered
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
