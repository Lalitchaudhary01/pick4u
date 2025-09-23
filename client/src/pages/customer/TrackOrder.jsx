import { useState } from "react";
import { getOrderStatus } from "../../api/orderApi";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await getOrderStatus(orderId);
      setStatus(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Order not found");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚚 Track Order</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={handleTrack}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Track
        </button>
      </div>

      {status && (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <p>
            <b>Order ID:</b> {status.orderId}
          </p>
          <p>
            <b>Current Status:</b> {status.status}
          </p>
        </div>
      )}
    </div>
  );
}
