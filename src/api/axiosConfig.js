// src/api/axiosConfig.js
import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "https://vibevaultbackendapp.azurewebsites.net/api/v1", // Replace with your backend URL
  baseURL: "https://localhost:7290/api/v1", // Replace with your backend URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
