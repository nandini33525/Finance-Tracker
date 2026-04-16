// src/utils/formatters.js

/**
 * Format a number as Indian Rupees
 * e.g.  2500 → "₹2,500"
 */
export const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

/**
 * Today's date as YYYY-MM-DD string
 */
export const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * Current month as YYYY-MM string
 */
export const monthStr = () => new Date().toISOString().slice(0, 7);

/**
 * Generate a short unique id (client-side fallback only; real IDs come from MongoDB)
 */
export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

/**
 * Return greeting based on time of day
 */
export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/**
 * Calculate months remaining to reach a goal
 */
export const monthsLeft = (total, saved, monthly) => {
  const rem = total - saved;
  if (rem <= 0 || monthly <= 0) return 0;
  return Math.ceil(rem / monthly);
};

/**
 * Get estimated completion date given months from now
 */
export const completionDate = (months) =>
  new Date(
    new Date().setMonth(new Date().getMonth() + months)
  ).toLocaleString("default", { month: "long", year: "numeric" });
