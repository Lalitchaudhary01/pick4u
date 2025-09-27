import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getAdminStats(token);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-gray-500">Users</h3>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-gray-500">Drivers</h3>
        <p className="text-2xl font-bold">{stats.totalDrivers}</p>
      </div>
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-gray-500">Orders</h3>
        <p className="text-2xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-gray-500">Revenue</h3>
        <p className="text-2xl font-bold">₹{stats.revenue}</p>
      </div>
    </div>
  );
}
