import API from "./axios";

// Orders
export const bookOrder = (data) => API.post("/customer/orders", data); // FIXED
export const getMyOrders = () => API.get("/customer/orders");
export const getOrderById = (id) => API.get(`/customer/orders/${id}`);
export const trackOrder = (id) => API.get(`/customer/orders/${id}/status`);

// Fare & Coupons
export const fareEstimate = (data) => API.post("/customer/fare-estimate", data);
export const applyCoupon = (data) => API.post("/customer/apply-coupon", data);
export const removeCoupon = (data) => API.post("/customer/remove-coupon", data);

// Payment (will integrate later)
export const pay = (data) => API.post("/customer/pay", data);
export const verifyPayment = (data) =>
  API.post("/customer/verify-payment", data);

// Profile
export const getProfile = () => API.get("/customer/profile"); // FIXED
