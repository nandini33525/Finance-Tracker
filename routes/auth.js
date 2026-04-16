const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { protect }                              = require("../middleware/auth");
const { validate, registerRules, loginRules }  = require("../middleware/validate");

const router = express.Router();

// ── Helper: sign JWT ─────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Helper: send token + user in response ────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:        user._id,
      name:       user.name,
      email:      user.email,
      phone:      user.phone,
      dob:        user.dob,
      city:       user.city,
      country:    user.country,
      dailyLimit: user.dailyLimit,
      notifications: user.notifications,
    },
  });
};

// ── POST /api/auth/register ──────────────────────────────────────────────────
router.post("/register", registerRules, validate, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Include password for comparison (select: false in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/auth/me  (protected) ────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── PUT /api/auth/profile  (protected) ──────────────────────────────────────
// Update name, phone, dob, city, country, dailyLimit, notifications
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, dob, city, country, dailyLimit, notifications } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, dob, city, country, dailyLimit, notifications },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/auth/password  (protected) ─────────────────────────────────────
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hash

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
