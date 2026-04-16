const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
      minlength: [2,  "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6,    "Password must be at least 6 characters"],
      select:    false, // Never return password in queries by default
    },
    phone:   { type: String, default: "" },
    dob:     { type: String, default: "" },
    city:    { type: String, default: "" },
    country: { type: String, default: "India" },

    // Daily spending limit set by the user
    dailyLimit: { type: Number, default: 0 },

    // Notification preferences
    notifications: {
      daily:  { type: Boolean, default: true  },
      weekly: { type: Boolean, default: false },
      goals:  { type: Boolean, default: true  },
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────────────────────────────
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain password with hashed ─────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
