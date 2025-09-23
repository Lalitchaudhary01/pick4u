import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/customer/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o._id}>
            <Link to={`/orders/${o._id}`}>
              {o.pickupAddress} → {o.dropAddress} | {o.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
