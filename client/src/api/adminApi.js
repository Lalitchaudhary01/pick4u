import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/admin",
});

export const getAllDrivers = (token) =>
  API.get("/drivers", { headers: { Authorization: `Bearer ${token}` } });

export const getAllOrders = (token) =>
  API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });

export const getAllCoupons = (token) =>
  API.get("/coupons", { headers: { Authorization: `Bearer ${token}` } });
