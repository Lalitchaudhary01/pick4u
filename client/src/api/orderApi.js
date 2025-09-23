import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // apne backend ka URL daalo
});

// JWT token attach automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Book new order
export const createOrder = (data) => API.post("/orders", data);

// Get my orders
export const getMyOrders = () => API.get("/orders");

// Get single order
export const getOrderById = (id) => API.get(`/orders/${id}`);

// Get order status
export const getOrderStatus = (id) => API.get(`/orders/${id}/status`);

