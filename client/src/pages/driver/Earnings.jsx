import React, { useEffect, useState } from "react";
import { getDriverEarnings } from "../../api/driverApi";

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await getDriverEarnings(token);
        setEarnings(res.data);
      } catch (err) {
        console.error("Error fetching earnings", err);
      }
    };
    fetchEarnings();
  }, [token]);

  if (!earnings) return <p className="text-center">Loading earnings...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Driver Earnings</h2>
      <p>
        <b>Total Earnings:</b> ₹{earnings.total}
      </p>
      <p>
        <b>This Week:</b> ₹{earnings.week}
      </p>
      <p>
        <b>This Month:</b> ₹{earnings.month}
      </p>
    </div>
  );
};

export default Earnings;
