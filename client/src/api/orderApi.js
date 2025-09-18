import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/order",
});

export const createOrder = (data, token) =>
  API.post("/create", data, { headers: { Authorization: `Bearer ${token}` } });

export const trackOrder = (orderId, token) =>
  API.get(`/track/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const cancelOrder = (orderId, token) =>
  API.post(
    `/cancel/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
