// utils/api.js
import axios from "axios";

const token = localStorage.getItem("token"); // ya session

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default API;
