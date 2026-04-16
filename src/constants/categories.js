// src/constants/categories.js

export const CAT_COLORS = {
  Food:          "#f97316",
  Transport:     "#3b82f6",
  Entertainment: "#a855f7",
  Utilities:     "#10b981",
  Health:        "#ec4899",
  Education:     "#f59e0b",
  Shopping:      "#06b6d4",
  Other:         "#6b7280",
  Savings:       "#22d3ee",
};

export const CAT_ICONS = {
  Food:          "🍜",
  Transport:     "🚗",
  Entertainment: "🎬",
  Utilities:     "⚡",
  Health:        "💪",
  Education:     "📚",
  Shopping:      "🛍️",
  Other:         "📦",
  Savings:       "💰",
};

export const CATEGORIES = Object.keys(CAT_COLORS);

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== "Savings");
export const GOAL_CATEGORIES    = CATEGORIES;
