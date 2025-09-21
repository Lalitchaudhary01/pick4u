import axios from "axios";

const API = axios.create({
  baseURL:  "http://localhost:5000/api/driver",
});

// Get driver profile
export const getDriverProfile = (token) =>
  API.get("/profile", { headers: { Authorization: `Bearer ${token}` } });

// Upload KYC documents
export const uploadKYC = (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("kycDocs", file));

  return API.post("/upload-kyc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
