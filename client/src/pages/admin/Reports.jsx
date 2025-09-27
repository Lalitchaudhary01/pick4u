import React, { useEffect, useState } from "react";
import { getReports } from "@/api/adminApi";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchReports() {
      const res = await getReports(token, "orders");
      setReports(res.data);
    }
    fetchReports();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <ul className="list-disc pl-6">
        {reports.map((r, i) => (
          <li key={i}>
            {r.type} - {r.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
