import React, { useState } from "react";
import { createOrder } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi";
import {
  MapPin,
  Package,
  Truck,
  Clock,
  ArrowRight,
  CheckCircle,
  Navigation,
  Zap,
  Calendar,
  Banknote,
  Smartphone,
} from "lucide-react";

export default function BookDelivery() {
  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
  });
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const deliveryTypes = [
    {
      id: "standard",
      name: "Standard Delivery",
      time: "2-4 hours",
      icon: <Truck className="w-5 h-5" />,
      color: "blue",
      price: "Starting from ₹50",
    },
    {
      id: "same-day",
      name: "Same Day",
      time: "Within 24 hours",
      icon: <Calendar className="w-5 h-5" />,
      color: "green",
      price: "Starting from ₹100",
    },
    {
      id: "instant",
      name: "Instant Delivery",
      time: "30-60 minutes",
      icon: <Zap className="w-5 h-5" />,
      color: "purple",
      price: "Starting from ₹150",
    },
  ];

  const getDeliveryTypeColor = (type, element) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        selected: "ring-blue-500 bg-blue-50 border-blue-500",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        selected: "ring-green-500 bg-green-50 border-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        selected: "ring-purple-500 bg-purple-50 border-purple-500",
      },
    };
    return colors[type][element] || "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeliveryTypeChange = (type) => {
    setForm({ ...form, deliveryType: type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    createOrder(form)
      .then((res) => {
        setResponse(res.data.order);
        setPaymentLoading(true);

        // ✅ Auto COD payment
        createPayment({ orderId: res.data.order._id, method: "cod" })
          .then(() => {
            alert("Cash on Delivery selected. Pay on delivery.");
          })
          .catch((err) => {
            console.error("Payment error:", err);
            alert("Error selecting COD");
          })
          .finally(() => setPaymentLoading(false));
      })
      .catch((err) => {
        console.error("Order creation error:", err);
        alert(err.response?.data?.message || "Error creating order");
      })
      .finally(() => setIsLoading(false));
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
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="text-gray-900">Book </span>
            <span className="text-blue-600">Delivery</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Fast, reliable delivery at your fingertips
          </p>
        </div>

        {!response ? (
          /* Order Form */
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <div className="space-y-8">
              {/* Pickup Address */}
              <div className="group">
                <label className="text-gray-700 text-sm font-semibold mb-3 block">
                  Pickup Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="pickupAddress"
                    placeholder="Enter pickup location"
                    value={form.pickupAddress}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Drop Address */}
              <div className="group">
                <label className="text-gray-700 text-sm font-semibold mb-3 block">
                  Delivery Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Navigation className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="dropAddress"
                    placeholder="Enter delivery location"
                    value={form.dropAddress}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Package Weight */}
              <div className="group">
                <label className="text-gray-700 text-sm font-semibold mb-3 block">
                  Package Weight (kg) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  <input
                    type="number"
                    name="packageWeight"
                    placeholder="Enter package weight"
                    value={form.packageWeight}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Delivery Type Selection */}
              <div>
                <label className="text-gray-700 text-sm font-semibold mb-4 block">
                  Choose Delivery Type *
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {deliveryTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleDeliveryTypeChange(type.id)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        form.deliveryType === type.id
                          ? getDeliveryTypeColor(type.color, "selected") +
                            " ring-2"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                          form.deliveryType === type.id
                            ? getDeliveryTypeColor(type.color, "bg")
                            : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={
                            form.deliveryType === type.id
                              ? getDeliveryTypeColor(type.color, "text")
                              : "text-gray-600"
                          }
                        >
                          {type.icon}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{type.time}</p>
                      <p className="text-xs font-medium text-gray-500">
                        {type.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden group ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                }`}
              >
                {!isLoading ? (
                  <div className="relative flex items-center justify-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Book Delivery Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Order...</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Order Confirmation */
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Order Created Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your delivery has been booked. Cash on Delivery is selected by
              default.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 mb-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Order ID
                  </h4>
                  <p className="text-xl font-black text-gray-900">
                    {response._id}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Status
                  </h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {response.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Total Fare
                  </h4>
                  <p className="text-2xl font-black text-blue-600">
                    ₹{response.fare}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
