import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const getAllDrivers = (token) =>
  API.get("/drivers", { headers: { Authorization: `Bearer ${token}` } });

export const getAllOrders = (token) =>
  API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });

export const getAllCoupons = (token) =>
  API.get("/coupons", { headers: { Authorization: `Bearer ${token}` } });
