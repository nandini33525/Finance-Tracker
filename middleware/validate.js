const { body, validationResult } = require("express-validator");

// ── Helper: run validationResult and send 400 on failure ────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // First error only (clean UX)
      errors:  errors.array(),
    });
  }
  next();
};

// ── Auth validation rules ────────────────────────────────────────────────────
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── Expense validation rules ─────────────────────────────────────────────────
const expenseRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title too long"),
  body("amount")
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
  body("date")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be YYYY-MM-DD"),
  body("category")
    .optional()
    .isIn(["Food","Transport","Entertainment","Utilities","Health","Education","Shopping","Other"])
    .withMessage("Invalid category"),
];

// ── Goal validation rules ────────────────────────────────────────────────────
const goalRules = [
  body("name").trim().notEmpty().withMessage("Goal name is required"),
  body("total").isFloat({ gt: 0 }).withMessage("Target amount must be positive"),
  body("monthly").isFloat({ gt: 0 }).withMessage("Monthly savings must be positive"),
  body("saved").optional().isFloat({ min: 0 }).withMessage("Saved amount cannot be negative"),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  expenseRules,
  goalRules,
};
