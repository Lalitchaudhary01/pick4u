import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import OrderTable from "../../components/admin/OrderTable";
import axios from "axios";

const AllOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/drivers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const available = response.data.filter(
        (driver) =>
          driver.availability &&
          driver.kycStatus === "APPROVED" &&
          !driver.user?.isBlocked
      );
      setAvailableDrivers(available);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleAssignDriver = async (order) => {
    setSelectedOrder(order);
    await fetchAvailableDrivers();
    setShowAssignModal(true);
  };

  const confirmAssignDriver = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/orders/${selectedOrder._id}/assign`,
        { driverId: selectedDriver },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Driver assigned successfully!");
      setShowAssignModal(false);
      setSelectedOrder(null);
      setSelectedDriver("");
      fetchOrders(); // Refresh orders
    } catch (error) {
      alert(
        "Error assigning driver: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleViewDetails = (order) => {
    // Navigate to order details page or show modal
    alert(`View details for order ${order._id}`);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
            <p className="text-gray-600">
              Manage and monitor all delivery orders
            </p>
          </div>

          {/* Stats and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {filteredOrders.length} {filter === "all" ? "Total" : filter}{" "}
                  Orders
                </h3>
                <p className="text-gray-600">
                  Manage delivery orders across the system
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "pending"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending ({getStatusCount("pending")})
                </button>
                <button
                  onClick={() => setFilter("accepted")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "accepted"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active (
                  {getStatusCount("accepted") +
                    getStatusCount("picked-up") +
                    getStatusCount("on-the-way")}
                  )
                </button>
                <button
                  onClick={() => setFilter("delivered")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "delivered"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Delivered ({getStatusCount("delivered")})
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <OrderTable
            orders={filteredOrders}
            onAssignDriver={handleAssignDriver}
            onViewDetails={handleViewDetails}
          />

          {/* Assign Driver Modal */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Assign Driver to Order #{selectedOrder?._id?.slice(-6)}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Available Driver
                    </label>
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a driver</option>
                      {availableDrivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.user?.name} - {driver.user?.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {availableDrivers.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                      <p className="text-yellow-700 text-sm">
                        No available drivers at the moment. All approved drivers
                        are either busy or offline.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setSelectedOrder(null);
                        setSelectedDriver("");
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAssignDriver}
                      disabled={!selectedDriver}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Assign Driver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllOrders;
