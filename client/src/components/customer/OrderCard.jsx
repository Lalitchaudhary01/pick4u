import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrackOrder = () => {
    navigate(`/customer/track/${order._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/customer/orders/${order._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{order._id?.slice(-6)}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status?.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Pickup</p>
          <p className="text-gray-800 font-medium">
            {order.pickupAddress?.slice(0, 50)}...
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Delivery</p>
          <p className="text-gray-800 font-medium">
            {order.dropAddress?.slice(0, 50)}...
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-gray-900">₹{order.fare}</p>
          <p className="text-sm text-gray-600">
            {order.packageWeight} kg • {order.deliveryType}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Details
          </button>
          {!["delivered", "cancelled"].includes(order.status) && (
            <button
              onClick={handleTrackOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
