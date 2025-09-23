import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/customer/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Orders: {orders.length}</p>
      {orders.length > 0 && <p>Last Order Status: {orders[0].status}</p>}
    </div>
  );
}
