import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import axios from "axios";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/customer/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orders = response.data.slice(0, 5); // Get recent 5 orders
      setRecentOrders(orders);

      setStats({
        totalOrders: response.data.length,
        pendingOrders: response.data.filter(
          (order) => order.status === "pending"
        ).length,
        deliveredOrders: response.data.filter(
          (order) => order.status === "delivered"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">Ready to send a package?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.deliveredOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/customer/new-order"
              className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-3">🚚</span>
              <h3 className="text-xl font-semibold mb-2">New Delivery</h3>
              <p className="text-blue-100">Create a new delivery order</p>
            </Link>

            <Link
              to="/customer/orders"
              className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-3">📋</span>
              <h3 className="text-xl font-semibold mb-2">My Orders</h3>
              <p className="text-green-100">View your order history</p>
            </Link>

            <Link
              to="/customer/profile"
              className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-3">👤</span>
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-purple-100">Manage your account</p>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Orders
              </h2>
              <Link
                to="/customer/orders"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order._id?.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.pickupAddress?.slice(0, 30)}... →{" "}
                        {order.dropAddress?.slice(0, 30)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.fare}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link
                  to="/customer/new-order"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Order
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
