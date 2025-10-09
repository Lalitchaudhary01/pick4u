import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const { id } = useParams(); // order id from route
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/customer"; // backend URL
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response || err);
        setError("Failed to fetch order details.");
        setLoading(false);
      });
  }, [id]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      assigned: { bg: "bg-purple-100", text: "text-purple-800", icon: "📝" },
      accepted: { bg: "bg-blue-100", text: "text-blue-800", icon: "👍" },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
      picked: { bg: "bg-indigo-100", text: "text-indigo-800", icon: "📦" },
      "in-transit": { bg: "bg-blue-100", text: "text-blue-800", icon: "🚚" },
      delivered: { bg: "bg-green-100", text: "text-green-800", icon: "✅" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
    };
    return (
      styles[status.toLowerCase()] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
      }
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading order details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        {error}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#0500FF] text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );

  const statusStyle = getStatusStyle(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.icon} {order.status}
          </span>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-gray-700">Order ID:</h2>
          <p className="text-gray-800">{order._id}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-gray-700">Created At:</h2>
          <p className="text-gray-800">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Pickup */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-gray-500 text-sm font-semibold mb-1">
              Pickup Location
            </h3>
            <p className="text-gray-800">{order.pickupAddress}</p>
          </div>

          {/* Drop */}
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="text-gray-500 text-sm font-semibold mb-1">
              Drop Location
            </h3>
            <p className="text-gray-800">{order.dropAddress}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">⚖️</span>
            <span className="text-gray-600">Weight:</span>
            <span className="font-semibold text-gray-800">
              {order.packageWeight} kg
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">🚀</span>
            <span className="text-gray-600">Type:</span>
            <span className="font-semibold text-gray-800 capitalize">
              {order.deliveryType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">💰</span>
            <span className="text-gray-600">Fare:</span>
            <span className="font-bold text-[#0500FF] text-lg">
              ₹{order.fare}
            </span>
          </div>

          {order.assignedDriver && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">👤</span>
              <span className="text-gray-600">Driver:</span>
              <span className="font-semibold text-gray-800">
                {order.assignedDriver.name}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          {["pending", "assigned", "accepted"].includes(
            order.status.toLowerCase()
          ) && (
            <button
              onClick={() => {
                axios
                  .put(
                    `${API_URL}/orders/${id}/cancel`,
                    {},
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                  .then((res) => {
                    alert("Order cancelled successfully");
                    setOrder(res.data);
                  })
                  .catch((err) => {
                    console.error(err.response || err);
                    alert("Failed to cancel order");
                  });
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              Cancel Order
            </button>
          )}
          {order.status.toLowerCase() === "in-transit" && (
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all">
              Track Live
            </button>
          )}
          <Link
            to="/customer/orders"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
