const express = require("express");
const Goal    = require("../models/Goal");
const { protect }                = require("../middleware/auth");
const { validate, goalRules }    = require("../middleware/validate");

const router = express.Router();

router.use(protect);

// ── GET /api/goals ───────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/goals ──────────────────────────────────────────────────────────
router.post("/", goalRules, validate, async (req, res) => {
  try {
    const { name, total, saved, monthly, category } = req.body;
    const goal = await Goal.create({
      user: req.user._id,
      name, total, saved: saved || 0, monthly, category,
    });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/goals/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/goals/:id ───────────────────────────────────────────────────────
router.put("/:id", goalRules, validate, async (req, res) => {
  try {
    const { name, total, saved, monthly, category } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, total, saved, monthly, category },
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/goals/:id ────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
