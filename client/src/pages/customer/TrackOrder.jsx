import React, { useState } from "react";
import { getOrderStatus } from "../../api/orderApi";
import {
  Search,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Navigation,
  User,
  Phone,
  Calendar,
  Star,
  RefreshCw,
} from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setStatus(null);

    try {
      const res = await getOrderStatus(orderId);
      setStatus(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found");
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "picked up":
      case "in transit":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "picked up":
      case "in transit":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <Package className="w-5 h-5" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const trackingSteps = [
    {
      id: "pending",
      label: "Order Placed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "picked up",
      label: "Package Picked Up",
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: "in transit",
      label: "In Transit",
      icon: <Navigation className="w-4 h-4" />,
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: <Package className="w-4 h-4" />,
    },
  ];

  const getCurrentStepIndex = (currentStatus) => {
    const statusMap = {
      pending: 0,
      confirmed: 1,
      "picked up": 2,
      "in transit": 3,
      delivered: 4,
    };
    return statusMap[currentStatus?.toLowerCase()] ?? -1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-2xl border border-gray-200">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="text-gray-900">Track </span>
            <span className="text-blue-600">Order</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your order ID to track your delivery status
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
          <div className="max-w-2xl mx-auto">
            <label className="text-gray-700 text-sm font-semibold mb-3 block">
              Order ID *
            </label>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your order ID (e.g., ORD-12345)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className={`px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden group ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                }`}
              >
                {!isLoading && (
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                )}
                <div className="relative flex items-center space-x-2">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">Order Not Found</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Display */}
        {status && (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                    status.status
                  )}`}
                >
                  {getStatusIcon(status.status)}
                  <span className="ml-2">{status.status}</span>
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold text-gray-900">
                        {status.orderId}
                      </p>
                    </div>
                  </div>

                  {status.pickupAddress && (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">Pickup Location</p>
                        <p className="font-medium text-blue-800">
                          {status.pickupAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  {status.dropAddress && (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl">
                      <Navigation className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">
                          Delivery Location
                        </p>
                        <p className="font-medium text-green-800">
                          {status.dropAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {status.fare && (
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-2xl">
                      <Star className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-600">Total Fare</p>
                        <p className="font-bold text-purple-800 text-xl">
                          ₹{status.fare}
                        </p>
                      </div>
                    </div>
                  )}

                  {status.createdAt && (
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-2xl">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-yellow-600">Order Placed</p>
                        <p className="font-medium text-yellow-800">
                          {new Date(status.createdAt).toLocaleDateString()} at{" "}
                          {new Date(status.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {status.driverName && (
                    <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-2xl">
                      <User className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-indigo-600">Driver</p>
                        <p className="font-medium text-indigo-800">
                          {status.driverName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tracking Timeline
              </h3>

              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const currentIndex = getCurrentStepIndex(status.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={step.id}
                      className="relative flex items-center mb-6 last:mb-0"
                    >
                      {/* Timeline Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-8 ${
                            isCompleted ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        ></div>
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-blue-600/20" : ""}`}
                      >
                        {step.icon}
                      </div>

                      {/* Step Label */}
                      <div className="ml-4">
                        <p
                          className={`font-medium ${
                            isCompleted ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-blue-600 font-medium">
                            Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-lg border-2 border-gray-200 rounded-2xl font-medium text-gray-700 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!status && !error && !isLoading && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-200 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Track Your Order
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your order ID above to see real-time tracking information
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">
                  Real-time Updates
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl">
                <MapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">
                  Live Location
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl">
                <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-800">
                  Driver Details
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
