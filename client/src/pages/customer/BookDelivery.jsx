import { useState } from "react";
import { createOrder } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi"; // ✅ add this

export default function BookDelivery() {
  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createOrder(form);
      setResponse(res.data.order); // ✅ save order response
    } catch (err) {
      alert(err.response?.data?.message || "Error creating order");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Book Delivery</h2>

      {/* --- Order Form --- */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={form.pickupAddress}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Drop Address</label>
          <input
            type="text"
            name="dropAddress"
            value={form.dropAddress}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Package Weight (kg)</label>
          <input
            type="number"
            name="packageWeight"
            value={form.packageWeight}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Delivery Type</label>
          <select
            name="deliveryType"
            value={form.deliveryType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="standard">Standard</option>
            <option value="same-day">Same Day</option>
            <option value="instant">Instant</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Book Now
        </button>
      </form>

      {/* --- Order Created Response + Payment Options --- */}
      {response && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h3 className="font-semibold">✅ Order Created</h3>
          <p>
            <b>Order ID:</b> {response._id}
          </p>
          <p>
            <b>Status:</b> {response.status}
          </p>
          <p>
            <b>Fare:</b> ₹{response.fare}
          </p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Choose Payment Method</h4>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded mr-2"
              onClick={async () => {
                try {
                  await createPayment({ orderId: response._id, method: "cod" });
                  alert("COD selected. Pay on delivery.");
                } catch (e) {
                  alert("Error selecting COD");
                }
              }}
            >
              Cash on Delivery
            </button>

            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={async () => {
                try {
                  await createPayment({
                    orderId: response._id,
                    method: "online",
                  });
                  alert("Online Payment initiated (stub).");
                } catch (e) {
                  alert("Error selecting Online Payment");
                }
              }}
            >
              Pay Online
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
