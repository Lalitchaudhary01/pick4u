import React, { useState } from "react";
import { bookOrder, fareEstimate } from "../../api";

export default function BookOrder() {
  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "same-day",
  });
  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState(null);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // 🔹 Get fare estimate
  const handleFare = async () => {
    try {
      const payload = {
        pickupAddress: form.pickupAddress,
        dropAddress: form.dropAddress,
        package: { weight: Number(form.packageWeight) },
        deliveryType: form.deliveryType,
      };

      const res = await fareEstimate(payload);
      setFare(res.data.fare);
    } catch (err) {
      console.error("Fare Estimate Error:", err.response?.data || err.message);
      setMessage(
        "❌ Failed to get fare estimate: " +
          (err.response?.data?.message || "Error")
      );
    }
  };

  // 🔹 Book order (without payment)
  const handleBook = async () => {
    if (!form.pickupAddress || !form.dropAddress || !form.packageWeight) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }
    try {
      const payload = {
        pickupAddress: form.pickupAddress,
        dropAddress: form.dropAddress,
        packageWeight: Number(form.packageWeight), // ✅ match schema
        deliveryType: form.deliveryType,
      };

      const res = await bookOrder(payload);
      setMessage(res.data.message || "✅ Order booked successfully!");
    } catch (err) {
      console.error("Book Order Error:", err.response?.data || err.message);
      setMessage(
        "❌ Failed to book order: " + (err.response?.data?.error || "Error")
      );
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Book New Order</h2>

      <input
        name="pickupAddress"
        value={form.pickupAddress}
        onChange={onChange}
        placeholder="Pickup Address"
        className="w-full border rounded p-2"
      />

      <input
        name="dropAddress"
        value={form.dropAddress}
        onChange={onChange}
        placeholder="Drop Address"
        className="w-full border rounded p-2"
      />

      <input
        name="packageWeight"
        value={form.packageWeight}
        onChange={onChange}
        placeholder="Weight (kg)"
        type="number"
        className="w-full border rounded p-2"
      />

      <select
        name="deliveryType"
        value={form.deliveryType}
        onChange={onChange}
        className="w-full border rounded p-2"
      >
        <option value="same-day">Same Day</option>
        <option value="instant">Instant</option>
      </select>

      <button
        onClick={handleFare}
        className="w-full bg-sky-600 text-white py-2 rounded"
      >
        Get Fare Estimate
      </button>
      {fare && <p className="text-green-600">Estimated Fare: ₹{fare}</p>}

      <button
        onClick={handleBook}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        Confirm Booking
      </button>

      {message && <p className="text-blue-600">{message}</p>}
    </div>
  );
}
