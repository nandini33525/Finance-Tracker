// src/App.js
import React, { useState, useEffect, useRef } from "react";
import "./styles/global.css";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import useAuth     from "./hooks/useAuth";
import useExpenses from "./hooks/useExpenses";
import useGoals    from "./hooks/useGoals";

// ── Components ────────────────────────────────────────────────────────────────
import Sidebar      from "./components/Sidebar";
import { AlertBanner, PageLoader } from "./components/UI";

// ── Pages ─────────────────────────────────────────────────────────────────────
import LandingPage   from "./pages/LandingPage";
import AuthPage      from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage  from "./pages/ExpensesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InsightsPage  from "./pages/InsightsPage";
import GoalsPage     from "./pages/GoalsPage";
import SettingsPage  from "./pages/SettingsPage";
import ProfilePage   from "./pages/ProfilePage";

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();

  // ── Screen state ──────────────────────────────────────────────────────────
  // "landing" | "auth" | "app" | "preview"
  const [screen,   setScreen]   = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [page,     setPage]     = useState("dashboard");

  // ── Data hooks (scoped per authenticated user) ────────────────────────────
  const isAuth = !!auth.user && screen === "app";
  const expenseHook = useExpenses(isAuth);
  const goalHook    = useGoals(isAuth);

  // ── Daily limit alert ─────────────────────────────────────────────────────
  const [alert,    setAlert]    = useState(null);
  const prevSpend  = useRef(0);
  const dailyLimit = auth.user?.dailyLimit || 0;

  useEffect(() => {
    if (!dailyLimit || !isAuth) return;
    const today = new Date().toISOString().split("T")[0];
    const spent = expenseHook.expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + e.amount, 0);

    if (spent > dailyLimit && prevSpend.current <= dailyLimit) {
      setAlert(`Daily limit exceeded! Spent ₹${spent.toLocaleString("en-IN")} today (limit: ₹${dailyLimit.toLocaleString("en-IN")})`);
    }
    prevSpend.current = spent;
  }, [expenseHook.expenses, dailyLimit, isAuth]);

  // ── After auth completes, move to app ─────────────────────────────────────
  useEffect(() => {
    if (auth.user && screen === "auth") {
      setScreen("app");
      setPage("dashboard");
    }
  }, [auth.user, screen]);

  // ── While restoring session, show loader ──────────────────────────────────
  if (auth.loading) return <PageLoader />;

  // ── If returning user has valid token, go straight to app ─────────────────
  // (This handles the "data survives logout" case: token in localStorage
  //  is re-validated on mount; if valid, we resume right where they left off)
  const effectiveScreen = auth.user && screen === "landing" ? "app" : screen;

  // ── Navigation helpers ────────────────────────────────────────────────────
  const goAuth = (mode) => {
    if (mode === "preview") { setScreen("preview"); return; }
    setAuthMode(mode);
    setScreen("auth");
  };

  const handleLogout = () => {
    auth.logout();           // Removes token; data stays in MongoDB
    setScreen("landing");
    setPage("dashboard");
    prevSpend.current = 0;
  };

  // Total tracked (for sidebar badge)
  const total = expenseHook.expenses.reduce((s, e) => s + e.amount, 0);

  // ── LANDING ───────────────────────────────────────────────────────────────
  if (effectiveScreen === "landing") {
    return <LandingPage onGoAuth={goAuth} />;
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────
  if (effectiveScreen === "auth") {
    return (
      <AuthPage
        mode={authMode}
        authHook={auth}
        onBack={() => setScreen("landing")}
      />
    );
  }

  // ── PREVIEW (read-only, no real data) ─────────────────────────────────────
  if (effectiveScreen === "preview") {
    return (
      <PreviewShell
        onGoAuth={goAuth}
        goBack={() => setScreen("landing")}
      />
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05050e" }}>
      {alert && <AlertBanner msg={alert} onClose={() => setAlert(null)} />}

      <Sidebar
        page={page}
        setPage={setPage}
        user={auth.user}
        total={total}
      />

      <main
        style={{
          flex: 1,
          padding: "28px 32px",
          overflowY: "auto",
          maxWidth: "calc(100vw - 224px)",
        }}
      >
        {page === "dashboard" && (
          <DashboardPage
            expenses={expenseHook.expenses}
            goals={goalHook.goals}
            dailyLimit={dailyLimit}
            user={auth.user}
            onNavigate={setPage}
          />
        )}

        {page === "expenses" && (
          <ExpensesPage
            expenses={expenseHook.expenses}
            loading={expenseHook.loading}
            addExpense={expenseHook.addExpense}
            updateExpense={expenseHook.updateExpense}
            deleteExpense={expenseHook.deleteExpense}
            dailyLimit={dailyLimit}
          />
        )}

        {page === "analytics" && (
          <AnalyticsPage expenses={expenseHook.expenses} />
        )}

        {page === "insights" && (
          <InsightsPage expenses={expenseHook.expenses} />
        )}

        {page === "goals" && (
          <GoalsPage
            goals={goalHook.goals}
            loading={goalHook.loading}
            addGoal={goalHook.addGoal}
            updateGoal={goalHook.updateGoal}
            deleteGoal={goalHook.deleteGoal}
          />
        )}

        {page === "settings" && (
          <SettingsPage
            dailyLimit={dailyLimit}
            updateProfile={auth.updateProfile}
            user={auth.user}
          />
        )}

        {page === "profile" && (
          <ProfilePage
            user={auth.user}
            updateProfile={auth.updateProfile}
            changePassword={auth.changePassword}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW SHELL — read-only tour of the UI, no real API calls
// ─────────────────────────────────────────────────────────────────────────────
const PREVIEW_EXPENSES = [
  { _id: "p1", title: "Grocery Store",  amount: 2450, category: "Food",          date: "2026-04-12" },
  { _id: "p2", title: "Uber Ride",      amount: 380,  category: "Transport",     date: "2026-04-11" },
  { _id: "p3", title: "Netflix",        amount: 649,  category: "Entertainment", date: "2026-04-10" },
  { _id: "p4", title: "Electricity",    amount: 1800, category: "Utilities",     date: "2026-04-09" },
  { _id: "p5", title: "Gym",            amount: 1200, category: "Health",        date: "2026-04-08" },
  { _id: "p6", title: "Online Course",  amount: 1999, category: "Education",     date: "2026-03-20" },
];

const PREVIEW_GOALS = [
  { _id: "g1", name: "Emergency Fund", total: 100000, saved: 35000, monthly: 5000, category: "Savings" },
  { _id: "g2", name: "New Laptop",     total: 80000,  saved: 20000, monthly: 8000, category: "Education" },
];

const PREVIEW_USER = { name: "Preview User", email: "preview@finwise.app", dailyLimit: 2000 };

const PreviewShell = ({ onGoAuth, goBack }) => {
  const [page, setPage] = useState("dashboard");

  // Auth-gate modal state
  const [showGate, setShowGate] = useState(false);

  const authRequired = () => setShowGate(true);

  const total = PREVIEW_EXPENSES.reduce((s, e) => s + e.amount, 0);

  const noop = async () => ({ success: false, message: "Sign in to make changes" });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05050e" }}>
      {/* Auth gate overlay */}
      {showGate && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}
          onClick={(e) => e.target === e.currentTarget && setShowGate(false)}
        >
          <div className="modal-wrap" style={{ background: "#0b0b1a", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "32px", width: "100%", maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", marginBottom: 10 }}>Sign in to continue</h3>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>Create a free account to add expenses, set goals, and track your real finances.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="hov-btn" onClick={() => onGoAuth("signup")} style={{ width: "100%", background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "13px", fontSize: 15, fontWeight: 600, color: "#fff", cursor: "pointer" }}>🚀 Create Free Account</button>
              <button className="hov-btn" onClick={() => onGoAuth("login")} style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "13px", fontSize: 14, color: "#94a3b8", cursor: "pointer" }}>Sign In</button>
              <button onClick={() => setShowGate(false)} style={{ background: "none", border: "none", color: "#4b5563", fontSize: 13, cursor: "pointer", marginTop: 4, fontFamily: "'Instrument Sans',sans-serif" }}>Continue browsing preview</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar page={page} setPage={setPage} user={PREVIEW_USER} total={total} isPreview />

      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: "calc(100vw - 224px)" }}>
        {/* Preview banner */}
        <div style={{ background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.2)", borderRadius: 12, padding: "10px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#a855f7" }}>👀 You're viewing a <strong>read-only preview</strong> with sample data.</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="hov-btn" onClick={() => onGoAuth("signup")} style={{ background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 9, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Create Account</button>
            <button className="hov-btn" onClick={goBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, padding: "7px 14px", fontSize: 12, color: "#64748b", cursor: "pointer" }}>← Back</button>
          </div>
        </div>

        {page === "dashboard" && (
          <DashboardPage
            expenses={PREVIEW_EXPENSES}
            goals={PREVIEW_GOALS}
            dailyLimit={2000}
            user={PREVIEW_USER}
            onNavigate={setPage}
          />
        )}
        {page === "expenses" && (
          <ExpensesPage
            expenses={PREVIEW_EXPENSES}
            loading={false}
            addExpense={authRequired}
            updateExpense={authRequired}
            deleteExpense={authRequired}
            dailyLimit={2000}
          />
        )}
        {page === "analytics" && <AnalyticsPage expenses={PREVIEW_EXPENSES} />}
        {page === "insights"  && <InsightsPage  expenses={PREVIEW_EXPENSES} />}
        {page === "goals" && (
          <GoalsPage
            goals={PREVIEW_GOALS}
            loading={false}
            addGoal={authRequired}
            updateGoal={authRequired}
            deleteGoal={authRequired}
          />
        )}
        {page === "settings" && (
          <SettingsPage
            dailyLimit={2000}
            updateProfile={authRequired}
            user={PREVIEW_USER}
          />
        )}
        {page === "profile" && (
          <ProfilePage
            user={PREVIEW_USER}
            updateProfile={authRequired}
            changePassword={authRequired}
            onLogout={() => onGoAuth("login")}
          />
        )}
      </main>
    </div>
  );
};
