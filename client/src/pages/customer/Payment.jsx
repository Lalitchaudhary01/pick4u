import { useEffect, useState } from "react";
import { getMyPayments } from "../../api/paymentApi";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMyPayments();
        setPayments(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading payments...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💳 My Payments</h2>
      {payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Txn ID</th>
                <th className="border px-3 py-2">Order</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Method</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="border px-3 py-2">{p._id.slice(-6)}</td>
                  <td className="border px-3 py-2">
                    {p.order
                      ? `${p.order.pickupAddress} → ${p.order.dropAddress}`
                      : "Order deleted"}
                  </td>
                  <td className="border px-3 py-2">₹{p.amount}</td>
                  <td className="border px-3 py-2 uppercase">{p.method}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        p.status === "paid"
                          ? "bg-green-200 text-green-800"
                          : p.status === "failed"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
