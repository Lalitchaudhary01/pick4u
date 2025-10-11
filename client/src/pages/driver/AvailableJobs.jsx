import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import JobCard from "../../components/driver/JobCard";
import axios from "axios";

const AvailableJobs = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [driverProfile, setDriverProfile] = useState(null); // ✅ Added

  useEffect(() => {
    fetchDriverProfile(); // ✅ Fetch Driver Profile
    fetchAvailableJobs();

    // Socket listeners
    if (socket) {
      socket.on("new-order", (newOrder) => {
        setJobs((prev) => [newOrder, ...prev]);
      });

      socket.on("order-accepted", (acceptedOrder) => {
        setJobs((prev) => prev.filter((job) => job._id !== acceptedOrder._id));
      });

      // ✅ KYC Approval Listener
      socket.on("kyc-approved", (approvedDriver) => {
        if (approvedDriver._id === driverProfile?._id) {
          alert("🎉 Your KYC has been approved! You can now accept jobs.");
          fetchDriverProfile(); // Refresh profile
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("new-order");
        socket.off("order-accepted");
        socket.off("kyc-approved");
      }
    };
  }, [socket, driverProfile]);

  // ✅ Fetch Driver Profile
  const fetchDriverProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/driver/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDriverProfile(response.data);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/driver/orders/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching available jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    // ✅ Check KYC before accepting
    if (driverProfile?.kycStatus !== "APPROVED") {
      alert("❌ Please complete KYC verification before accepting jobs.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/driver/jobs/${jobId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Job accepted successfully!");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      alert(
        "❌ Error accepting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/driver/jobs/${jobId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job rejected");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      alert(
        "Error rejecting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "high-value") return job.fare > 100;
    if (filter === "short-distance") return true; // future logic
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
            <p className="text-gray-600">
              Accept new delivery requests and start earning
            </p>
          </div>

          {/* ✅ KYC Messages */}
          {driverProfile?.kycStatus !== "APPROVED" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    {driverProfile?.kycStatus === "PENDING"
                      ? "KYC Under Review"
                      : "KYC Verification Required"}
                  </h3>
                  <p className="text-yellow-700">
                    {driverProfile?.kycStatus === "PENDING"
                      ? "Your KYC documents are under review. You will be notified once approved."
                      : "You need to complete KYC verification before accepting jobs."}{" "}
                    <a
                      href="/driver/kyc"
                      className="underline font-medium text-blue-700"
                    >
                      {driverProfile?.kycStatus === "PENDING"
                        ? "Check Status"
                        : "Complete KYC"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {driverProfile?.kycStatus === "APPROVED" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">
                    KYC Approved!
                  </h3>
                  <p className="text-green-700">
                    You can now accept delivery jobs and start earning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Stats & Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {filteredJobs.length} Available{" "}
                  {filteredJobs.length === 1 ? "Job" : "Jobs"}
                </h3>
                <p className="text-gray-600">
                  Real-time delivery requests in your area
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Jobs
                </button>
                <button
                  onClick={() => setFilter("high-value")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "high-value"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  High Value
                </button>
                <button
                  onClick={() => setFilter("short-distance")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "short-distance"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Short Distance
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Jobs Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onReject={handleRejectJob}
                  showActions={driverProfile?.kycStatus === "APPROVED"}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Available Jobs
              </h3>
              <p className="text-gray-600 mb-6">
                There are no delivery requests available at the moment. New jobs
                will appear here in real-time.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-700">
                  💡 Tips: Keep the app open to receive instant job
                  notifications
                </p>
              </div>
            </div>
          )}

          {/* ✅ Real-time Indicator */}
          {jobs.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live - New jobs appear in real-time
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AvailableJobs;
