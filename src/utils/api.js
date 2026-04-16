// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT if present ───────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finwise_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: auto-logout on 401 ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("finwise_token");
      localStorage.removeItem("finwise_user");
      // Reload page – AuthContext will detect missing token and show login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
