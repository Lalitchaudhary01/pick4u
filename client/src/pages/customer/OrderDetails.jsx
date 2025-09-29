import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Order Details</h2>
      <p>Pickup: {order.pickupAddress}</p>
      <p>Drop: {order.dropAddress}</p>
      <p>Weight: {order.packageWeight}kg</p>
      <p>Status: {order.status}</p>
      <p>Fare: ₹{order.fare}</p>
    </div>
  );
}
