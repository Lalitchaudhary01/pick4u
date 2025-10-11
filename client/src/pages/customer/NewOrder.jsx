import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FareCalculator from "../../components/customer/FareCalculator";
import axios from "axios";

const NewOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
    fare: "",
  });
  const [loading, setLoading] = useState(false);
  const [calculatedFare, setCalculatedFare] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFareCalculated = (fareData) => {
    setCalculatedFare(fareData);
    setFormData((prev) => ({
      ...prev,
      fare: fareData.fare,
    }));
  };

  const createOrder = async () => {
    if (!calculatedFare) {
      alert("Please calculate fare first");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/customer/orders",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order created successfully!");
      navigate("/customer/orders");
    } catch (error) {
      alert(
        "Error creating order: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Delivery
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new delivery order
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Order Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address *
                  </label>
                  <textarea
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter complete pickup address with landmarks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="dropAddress"
                    value={formData.dropAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter complete delivery address with landmarks"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Weight (kg) *
                    </label>
                    <input
                      type="number"
                      name="packageWeight"
                      value={formData.packageWeight}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0.1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Type *
                    </label>
                    <select
                      name="deliveryType"
                      value={formData.deliveryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="standard">Standard (2-3 days)</option>
                      <option value="express">Express (24 hours)</option>
                      <option value="same-day">Same Day</option>
                    </select>
                  </div>
                </div>

                {calculatedFare && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Final Fare
                        </h4>
                        <p className="text-sm text-green-700">
                          Distance: {calculatedFare.distance} km
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{calculatedFare.fare}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={createOrder}
                  disabled={loading || !calculatedFare}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 font-semibold"
                >
                  {loading ? "Creating Order..." : "Create Order"}
                </button>
              </div>
            </div>

            {/* Fare Calculator */}
            <div>
              <FareCalculator onFareCalculated={handleFareCalculated} />

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  📋 Instructions
                </h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Fill all address details accurately</li>
                  <li>• Calculate fare before creating order</li>
                  <li>• Ensure package weight is correct</li>
                  <li>• Choose appropriate delivery type</li>
                  <li>• Driver will contact you for pickup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default NewOrder;
