const mongoose = require("mongoose");

const CATEGORIES = [
  "Food", "Transport", "Entertainment",
  "Utilities", "Health", "Education", "Shopping", "Other", "Savings",
];

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },
    name: {
      type:      String,
      required:  [true, "Goal name is required"],
      trim:      true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    total: {
      type:    Number,
      required:[true, "Target amount is required"],
      min:     [1,    "Target must be at least ₹1"],
    },
    saved: {
      type:    Number,
      default: 0,
      min:     [0, "Saved amount cannot be negative"],
    },
    monthly: {
      type:    Number,
      required:[true, "Monthly savings amount is required"],
      min:     [1,    "Monthly amount must be at least ₹1"],
    },
    category: {
      type:    String,
      enum:    { values: CATEGORIES, message: "{VALUE} is not a valid category" },
      default: "Savings",
    },
  },
  { timestamps: true }
);

// Virtual: months remaining to reach goal
GoalSchema.virtual("monthsLeft").get(function () {
  const remaining = this.total - this.saved;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / this.monthly);
});

// Virtual: percentage complete
GoalSchema.virtual("percentComplete").get(function () {
  return Math.min(100, Math.round((this.saved / this.total) * 100));
});

GoalSchema.set("toJSON",   { virtuals: true });
GoalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Goal", GoalSchema);
