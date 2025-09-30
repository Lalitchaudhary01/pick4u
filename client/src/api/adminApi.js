import API from "./axios";

// Dashboard
export const getDashboard = () => API.get("/admin/dashboard");

// Orders
export const getAllOrders = () => API.get("/admin/orders");
export const assignDriver = (id, data) =>
  API.put(`/admin/orders/${id}/assign`, data);
export const cancelOrder = (id) => API.put(`/admin/orders/${id}/cancel`);

// Drivers
export const getDrivers = () => API.get("/admin/drivers"); // ✅ yeh missing tha
export const approveDriver = (id) => API.put(`/admin/drivers/${id}/approve`);
export const blockDriver = (id) => API.put(`/admin/drivers/${id}/block`);

// Customers
export const getCustomers = () => API.get("/admin/customers");
export const suspendCustomer = (id) =>
  API.put(`/admin/customers/${id}/suspend`);

// Coupons
export const createCoupon = (data) => API.post("/admin/coupons", data);
export const getCoupons = () => API.get("/admin/coupons");
export const updateCoupon = (id, data) => API.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => API.delete(`/admin/coupons/${id}`);

// Fares
export const getFareConfig = () => API.get("/admin/fares");
export const updateFareConfig = (data) => API.put("/admin/fares", data);

// Reports
export const getOrderReport = () => API.get("/admin/reports/orders");
export const getRevenueReport = () => API.get("/admin/reports/revenue");
