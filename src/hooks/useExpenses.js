// src/hooks/useExpenses.js
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

/**
 * useExpenses
 * Manages all expense state and API calls for the authenticated user.
 * Data is fetched fresh from MongoDB on mount – never from localStorage –
 * so each user always sees only their own expenses.
 */
const useExpenses = (isAuthenticated) => {
  const [expenses, setExpenses] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // ── Fetch all expenses for the current user ───────────────────────────────
  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on mount / when auth state changes
  useEffect(() => {
    if (isAuthenticated) fetchExpenses();
    else setExpenses([]); // Clear when logged out
  }, [isAuthenticated, fetchExpenses]);

  // ── Add expense ───────────────────────────────────────────────────────────
  const addExpense = useCallback(async (expenseData) => {
    try {
      const { data } = await api.post("/expenses", expenseData);
      setExpenses((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to add expense" };
    }
  }, []);

  // ── Update expense ────────────────────────────────────────────────────────
  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const { data } = await api.put(`/expenses/${id}`, expenseData);
      setExpenses((prev) => prev.map((e) => (e._id === id ? data.data : e)));
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update expense" };
    }
  }, []);

  // ── Delete expense ────────────────────────────────────────────────────────
  // Uses expense._id (MongoDB ObjectId) — fixes the "undefined ID" bug
  const deleteExpense = useCallback(async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete expense" };
    }
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};

export default useExpenses;
