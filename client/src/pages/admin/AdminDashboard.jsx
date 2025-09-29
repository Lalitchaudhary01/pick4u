import React, { useEffect, useState } from "react";
import { getDashboard } from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboard().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-bold">Orders</h3>
        <p>{stats.totalOrders}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-bold">Drivers</h3>
        <p>{stats.totalDrivers}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-bold">Customers</h3>
        <p>{stats.totalCustomers}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-bold">Revenue</h3>
        <p>₹{stats.totalRevenue}</p>
      </div>
    </div>
  );
}
