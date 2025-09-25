import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/driver", // backend driver routes
});

// Attach token automatically if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("driverToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get driver profile
export const getDriverProfile = (token) =>
  API.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Upload KYC documents
export const uploadKYC = (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("kycDocs", file));

  return API.post("/kyc-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get driver earnings
export const getDriverEarnings = (token) =>
  API.get("/earnings", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ---------------- Driver Job Flow APIs ------------------

// Fetch all assigned jobs
export const getAssignedJobs = () => API.get("/assigned");

// Accept a job
export const acceptJob = (orderId) => API.put(`/orders/${orderId}/accept`);

// Decline a job
export const declineJob = (orderId) => API.put(`/orders/${orderId}/decline`);
