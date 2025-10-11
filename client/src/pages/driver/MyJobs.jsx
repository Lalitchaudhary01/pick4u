import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import JobCard from "../../components/driver/JobCard";
import axios from "axios";

const MyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/driver/jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Ensure jobs is always an array
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
      setError("Failed to load jobs. Please try again.");
      setJobs([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering - ensure jobs is always treated as array
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        if (filter === "active") {
          return ["accepted", "arrived", "picked-up", "on-the-way"].includes(
            job.status
          );
        } else if (filter === "completed") {
          return job.status === "delivered";
        }
        return true;
      })
    : [];

  const getStatusCount = (statusFilter) => {
    if (!Array.isArray(jobs)) return 0;

    return jobs.filter((job) => {
      if (statusFilter === "active") {
        return ["accepted", "arrived", "picked-up", "on-the-way"].includes(
          job.status
        );
      } else if (statusFilter === "completed") {
        return job.status === "delivered";
      }
      return false;
    }).length;
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      const token = localStorage.getItem("token");

      let endpoint = "";
      switch (status) {
        case "arrived":
          endpoint = `arrived`;
          break;
        case "picked-up":
          endpoint = `picked-up`;
          break;
        case "on-the-way":
          endpoint = `on-the-way`;
          break;
        case "delivered":
          endpoint = `delivered`;
          break;
        default:
          return;
      }

      await axios.put(
        `http://localhost:5000/api/driver/jobs/${jobId}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Status updated to ${status.replace("-", " ")}`);
      fetchMyJobs(); // Refresh jobs list
    } catch (error) {
      alert(
        "Error updating status: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4 text-red-500">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Error Loading Jobs
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchMyJobs}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Jobs</h1>
            <p className="text-gray-600">Manage your assigned delivery jobs</p>
          </div>

          {/* Stats and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {getStatusCount("active")}
                  </p>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {getStatusCount("completed")}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {Array.isArray(jobs) ? jobs.length : 0}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active ({getStatusCount("active")})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed ({getStatusCount("completed")})
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <JobCard job={job} showActions={false} />

                  {/* Status Update Actions */}
                  {filter === "active" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Update Delivery Status
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.status === "accepted" && (
                          <button
                            onClick={() => updateJobStatus(job._id, "arrived")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            🏠 Mark Arrived at Pickup
                          </button>
                        )}
                        {(job.status === "accepted" ||
                          job.status === "arrived") && (
                          <button
                            onClick={() =>
                              updateJobStatus(job._id, "picked-up")
                            }
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                          >
                            📦 Mark Package Picked
                          </button>
                        )}
                        {job.status === "picked-up" && (
                          <button
                            onClick={() =>
                              updateJobStatus(job._id, "on-the-way")
                            }
                            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                          >
                            🚚 Mark On the Way
                          </button>
                        )}
                        {(job.status === "picked-up" ||
                          job.status === "on-the-way") && (
                          <button
                            onClick={() =>
                              updateJobStatus(job._id, "delivered")
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                          >
                            ✅ Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Contact */}
                  {job.customer && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Customer Contact
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-700">{job.customer.name}</p>
                          <p className="text-blue-600">{job.customer.phone}</p>
                        </div>
                        <a
                          href={`tel:${job.customer.phone}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          📞 Call Customer
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">
                {filter === "active" ? "📭" : "✅"}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === "active" ? "No Active Jobs" : "No Completed Jobs"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "active"
                  ? "You don't have any active delivery jobs at the moment."
                  : "You haven't completed any delivery jobs yet."}
              </p>
              {filter === "active" && (
                <a
                  href="/driver/jobs"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Find Available Jobs
                </a>
              )}
            </div>
          )}

          {/* Delivery Instructions */}
          {filter === "active" && filteredJobs.length > 0 && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">
                📋 Delivery Instructions
              </h4>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>• Always update delivery status promptly</li>
                <li>• Contact customer before arrival</li>
                <li>• Handle packages with care</li>
                <li>• Collect signature for delivery proof</li>
                <li>• Report any issues immediately</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyJobs;
