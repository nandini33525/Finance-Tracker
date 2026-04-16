// src/hooks/useGoals.js
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

/**
 * useGoals
 * Manages goal state and API calls for the authenticated user.
 */
const useGoals = (isAuthenticated) => {
  const [goals,   setGoals]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/goals");
      setGoals(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchGoals();
    else setGoals([]);
  }, [isAuthenticated, fetchGoals]);

  const addGoal = useCallback(async (goalData) => {
    try {
      const { data } = await api.post("/goals", goalData);
      setGoals((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to add goal" };
    }
  }, []);

  const updateGoal = useCallback(async (id, goalData) => {
    try {
      const { data } = await api.put(`/goals/${id}`, goalData);
      setGoals((prev) => prev.map((g) => (g._id === id ? data.data : g)));
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update goal" };
    }
  }, []);

  const deleteGoal = useCallback(async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete goal" };
    }
  }, []);

  return { goals, loading, error, fetchGoals, addGoal, updateGoal, deleteGoal };
};

export default useGoals;
