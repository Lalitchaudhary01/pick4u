import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/orderApi";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-6">Loading your orders...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📜 My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Order ID</th>
                <th className="border px-3 py-2">Pickup</th>
                <th className="border px-3 py-2">Drop</th>
                <th className="border px-3 py-2">Weight</th>
                <th className="border px-3 py-2">Fare</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border px-3 py-2">
                    <Link
                      to={`/customer/orders/${order._id}`}
                      className="text-indigo-600 underline"
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="border px-3 py-2">{order.pickupAddress}</td>
                  <td className="border px-3 py-2">{order.dropAddress}</td>
                  <td className="border px-3 py-2">{order.packageWeight} kg</td>
                  <td className="border px-3 py-2">₹{order.fare}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === "delivered"
                          ? "bg-green-200 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
