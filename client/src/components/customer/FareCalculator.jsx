import React, { useState } from "react";
import axios from "axios";

const FareCalculator = ({ onFareCalculated }) => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateFare = async () => {
    if (
      !formData.pickupAddress ||
      !formData.dropAddress ||
      !formData.packageWeight
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/customer/fare-estimate",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFare(response.data);
      if (onFareCalculated) {
        onFareCalculated(response.data);
      }
    } catch (error) {
      alert("Error calculating fare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Calculate Fare
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Address
          </label>
          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter complete pickup address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <textarea
            name="dropAddress"
            value={formData.dropAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter complete delivery address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Weight (kg)
            </label>
            <input
              type="number"
              name="packageWeight"
              value={formData.packageWeight}
              onChange={handleChange}
              step="0.1"
              min="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Type
            </label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="same-day">Same Day</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateFare}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate Fare"}
        </button>

        {fare && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="font-semibold text-green-800 mb-2">Fare Estimate</h4>
            <p className="text-2xl font-bold text-green-600">₹{fare.fare}</p>
            <p className="text-sm text-green-700">
              Distance: {fare.distance} km • {fare.deliveryType}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareCalculator;
