import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../api";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li
            key={o._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              {o.pickupAddress} → {o.dropAddress} ({o.status})
            </span>
            <Link
              to={`/customer/orders/${o._id}`}
              className="text-sky-600 hover:underline"
            >
              Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
