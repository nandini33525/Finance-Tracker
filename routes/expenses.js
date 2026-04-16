const express = require("express");
const Expense = require("../models/Expense");
const { protect }                    = require("../middleware/auth");
const { validate, expenseRules }     = require("../middleware/validate");

const router = express.Router();

// All expense routes require authentication
router.use(protect);

// ── GET /api/expenses ────────────────────────────────────────────────────────
// Supports query params: ?category=Food  ?startDate=2026-04-01  ?endDate=2026-04-30
router.get("/", async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = req.query.startDate;
      if (req.query.endDate)   filter.date.$lte = req.query.endDate;
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/expenses ───────────────────────────────────────────────────────
router.post("/", expenseRules, validate, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      title, amount, category, date, notes,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/expenses/:id ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/expenses/:id ────────────────────────────────────────────────────
router.put("/:id", expenseRules, validate, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // user check prevents cross-user edits
      { title, amount, category, date, notes },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/expenses/:id ─────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id:  req.params.id,   // ✅ Uses _id (fixes undefined ID bug from earlier)
      user: req.user._id,    // ✅ Ensures user can only delete their own data
    });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
