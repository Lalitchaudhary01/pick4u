import { useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function BookDelivery() {
  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    package: { weight: 1, type: "Documents" },
    deliveryType: "standard",
    distanceKm: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    if (field === "weight") {
      setForm((prev) => ({
        ...prev,
        package: { ...prev.package, weight: Number(value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!form.pickupAddress || !form.dropAddress) {
      setError("Pickup and drop addresses are required.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/customer/orders", form);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Book Delivery</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Pickup Address"
        value={form.pickupAddress}
        onChange={(e) => handleChange("pickupAddress", e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Drop Address"
        value={form.dropAddress}
        onChange={(e) => handleChange("dropAddress", e.target.value)}
      />
      <input
        type="number"
        className="w-full p-2 mb-3 border rounded"
        placeholder="Weight (kg)"
        min={0.1}
        step={0.1}
        value={form.package.weight}
        onChange={(e) => handleChange("weight", e.target.value)}
      />
      <select
        className="w-full p-2 mb-4 border rounded"
        value={form.deliveryType}
        onChange={(e) => handleChange("deliveryType", e.target.value)}
      >
        <option value="instant">Instant</option>
        <option value="same-day">Same Day</option>
        <option value="standard">Standard</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Booking..." : "Book Delivery"}
      </button>
    </form>
  );
}
