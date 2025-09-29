import React, { useEffect, useState } from "react";
import { getReports } from "../../api";

export default function DriverReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports().then((res) => setReports(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Driver Reports</h2>
      <ul className="mt-4 space-y-2">
        {reports.map((r, i) => (
          <li key={i} className="border p-3 rounded">
            {JSON.stringify(r)}
          </li>
        ))}
      </ul>
    </div>
  );
}
