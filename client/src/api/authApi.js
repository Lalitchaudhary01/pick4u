import axios from "axios";

// Base URL from Vite env or fallback
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  
});

// Register user
export const registerUser = (data) => API.post("/register", data);

// Verify OTP
export const verifyOTP = (data) => API.post("/verify-otp", data);

// Login user
export const loginUser = (data) => API.post("/login", data);

// Logout user
export const logoutUser = () => API.post("/logout");
