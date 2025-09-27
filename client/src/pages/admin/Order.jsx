import React, { useEffect, useState } from "react";
import { getAllOrders, assignDriver, cancelOrder } from "../../api/adminApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchOrders() {
      const res = await getAllOrders(token);
      setOrders(res.data);
    }
    fetchOrders();
  }, [token]);

  const handleCancel = async (id) => {
    await cancelOrder(id, token);
    setOrders(
      orders.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Orders</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Pickup</th>
            <th className="p-2 border">Drop</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="p-2 border">{o.customer?.name}</td>
              <td className="p-2 border">{o.pickupAddress}</td>
              <td className="p-2 border">{o.dropAddress}</td>
              <td className="p-2 border">{o.status}</td>
              <td className="p-2 border">
                {o.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
