import React, { useEffect, useState } from "react";
import { getAssignedJobs } from "../../api";
import { Link } from "react-router-dom";

export default function JobsAssigned() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getAssignedJobs().then((res) => setJobs(res.data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Assigned Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {job.pickupAddress} → {job.dropAddress}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-semibold">{job.status}</span>
                </p>
              </div>
              <Link
                to={`/driver/job/${job._id}`}
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Update Status
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
