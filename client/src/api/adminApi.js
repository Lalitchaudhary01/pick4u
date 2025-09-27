import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// Automatically add token to every request if passed
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ===== Dashboard Stats =====
export const getAdminStats = (token) => API.get("/stats", authHeaders(token));

// ===== Users =====
export const getAllUsers = (token) => API.get("/users", authHeaders(token));

export const blockUser = (id, token, isBlocked) =>
  API.put(`/users/${id}/block`, { isBlocked }, authHeaders(token));

// ===== Drivers =====
export const getAllDrivers = (token) => API.get("/drivers", authHeaders(token));

export const approveDriver = (id, token) =>
  API.put(`/drivers/${id}/approve`, {}, authHeaders(token));

export const rejectDriver = (id, token) =>
  API.put(`/drivers/${id}/reject`, {}, authHeaders(token));

// ===== Orders =====
export const getAllOrders = (token, status) =>
  API.get(`/orders${status ? `?status=${status}` : ""}`, authHeaders(token));

export const assignDriver = (orderId, driverId, token) =>
  API.put(`/orders/${orderId}/assign`, { driverId }, authHeaders(token));

export const cancelOrder = (orderId, token) =>
  API.put(`/orders/${orderId}/cancel`, {}, authHeaders(token));

// ===== Earnings =====
export const getEarnings = (token) => API.get("/earnings", authHeaders(token));

// ===== Reports =====
export const getReports = (token, type = "orders", from, to) =>
  API.get(
    `/reports?type=${type}${from ? `&from=${from}` : ""}${
      to ? `&to=${to}` : ""
    }`,
    authHeaders(token)
  );
