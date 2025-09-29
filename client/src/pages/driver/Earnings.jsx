import React, { useEffect, useState } from "react";
import { getEarnings } from "../../api";

export default function Earnings() {
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    getEarnings().then((res) => setEarnings(res.data.earnings));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">My Earnings</h2>
      <p className="text-green-600 mt-4 text-lg">₹{earnings}</p>
    </div>
  );
}
