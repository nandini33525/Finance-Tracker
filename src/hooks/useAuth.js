// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

/**
 * useAuth
 * Manages authentication state.
 * - Persists JWT + user object in localStorage so data survives logout/refresh
 * - On mount, re-validates the stored token with /api/auth/me
 * - Different users each get their own data (scoped by JWT on every API call)
 */
const useAuth = () => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while checking stored token
  const [error,   setError]   = useState("");

  // ── On mount: restore session from localStorage ──────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("finwise_token");
      if (!token) { setLoading(false); return; }

      try {
        const { data } = await api.get("/auth/me");
        if (data.success) setUser(data.user);
      } catch {
        // Token expired or invalid – clear storage
        localStorage.removeItem("finwise_token");
        localStorage.removeItem("finwise_user");
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setError("");
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("finwise_token", data.token);
      localStorage.setItem("finwise_user",  JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("finwise_token", data.token);
      localStorage.setItem("finwise_user",  JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  // Clears token from storage but does NOT delete MongoDB data.
  // When the same user logs back in, all their expenses/goals are restored.
  const logout = useCallback(() => {
    localStorage.removeItem("finwise_token");
    localStorage.removeItem("finwise_user");
    setUser(null);
  }, []);

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);
      setUser(data.user);
      localStorage.setItem("finwise_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Update failed" };
    }
  }, []);

  // ── Change password ───────────────────────────────────────────────────────
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Password update failed" };
    }
  }, []);

  return { user, loading, error, register, login, logout, updateProfile, changePassword, setError };
};

export default useAuth;
