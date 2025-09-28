import API from "./axios";

// KYC
export const uploadKyc = (data) => API.post("/driver/upload-kyc", data);

// Profile
export const getDriverProfile = () => API.get("/driver/profile");
export const updateDriverProfile = (data) => API.put("/driver/profile", data);

// Jobs
export const getAssignedJobs = () => API.get("/driver/jobs/assigned");
export const acceptJob = (id) => API.post(`/driver/jobs/${id}/accept`);
export const rejectJob = (id) => API.post(`/driver/jobs/${id}/reject`);

// Delivery Workflow
export const updateJobStatus = (id, data) =>
  API.put(`/driver/jobs/${id}/status`, data);
export const uploadProof = (id, data) =>
  API.post(`/driver/jobs/${id}/proof`, data);

// Earnings & Reports
export const getEarnings = () => API.get("/driver/earnings");
export const getReports = () => API.get("/driver/reports");
