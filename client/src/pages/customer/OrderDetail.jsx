import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error loading order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading order...</p>;
  if (!order) return <p className="text-center mt-6">Order not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📦 Order #{order._id}</h2>
      <div className="space-y-2">
        <p>
          <b>Status:</b> {order.status}
        </p>
        <p>
          <b>Pickup:</b> {order.pickupAddress}
        </p>
        <p>
          <b>Drop:</b> {order.dropAddress}
        </p>
        <p>
          <b>Weight:</b> {order.packageWeight} kg
        </p>
        <p>
          <b>Delivery Type:</b> {order.deliveryType}
        </p>
        <p>
          <b>Fare:</b> ₹{order.fare}
        </p>
        <p>
          <b>Booked At:</b> {new Date(order.createdAt).toLocaleString()}
        </p>
        {order.driver ? (
          <p>
            <b>Driver:</b> {order.driver.name} ({order.driver.phone})
          </p>
        ) : (
          <p className="text-gray-600">No driver assigned yet</p>
        )}
      </div>
    </div>
  );
}
