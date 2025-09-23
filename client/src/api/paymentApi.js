import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create Payment
export const createPayment = (data) => API.post("/payments", data);

// Get Payment Details
export const getPaymentById = (id) => API.get(`/payments/${id}`);

export const getMyPayments = () => API.get("/payments/me");
