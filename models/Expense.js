const mongoose = require("mongoose");

const CATEGORIES = [
  "Food", "Transport", "Entertainment",
  "Utilities", "Health", "Education", "Shopping", "Other",
];

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true, // Fast lookup by user
    },
    title: {
      type:      String,
      required:  [true, "Title is required"],
      trim:      true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type:    Number,
      required:[true, "Amount is required"],
      min:     [0.01, "Amount must be positive"],
    },
    category: {
      type:    String,
      enum:    { values: CATEGORIES, message: "{VALUE} is not a valid category" },
      default: "Other",
    },
    // Store as YYYY-MM-DD string for simple filtering
    date: {
      type:     String,
      required: [true, "Date is required"],
      match:    [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    notes: {
      type:      String,
      default:   "",
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
  },
  { timestamps: true }
);

// Compound index: fast queries for a user's expenses sorted by date
ExpenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
