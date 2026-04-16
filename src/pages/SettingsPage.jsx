// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { Panel, SectionTitle, Toggle, Field, Sel, BtnP } from "../components/UI";

const SettingsPage = ({ user, updateProfile }) => {
  const [dailyLimit, setDailyLimit] = useState(user?.dailyLimit || "");
  const [currency,   setCurrency]   = useState("INR (₹)");
  const [notif,      setNotif]      = useState(
    user?.notifications || { daily: true, weekly: false, goals: true }
  );
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [err,    setErr]    = useState("");

  // Sync if user prop changes (e.g. after re-login)
  useEffect(() => {
    setDailyLimit(user?.dailyLimit || "");
    if (user?.notifications) setNotif(user.notifications);
  }, [user]);

  const save = async () => {
    setSaving(true);
    setErr("");
    const result = await updateProfile({
      dailyLimit:    +dailyLimit || 0,
      notifications: notif,
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setErr(result.message || "Save failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>

      <SectionTitle className="fu" sub="Configure your app preferences">Settings</SectionTitle>

      {/* Budget limits */}
      <Panel className="fu2">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          💰 Budget Limits
        </div>
        <Field
          label="Daily Spending Limit (₹)"
          type="number"
          placeholder="e.g. 1500  (0 = no limit)"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
        />
        <p style={{ fontSize: 12, color: "#4b5563", marginTop: 8, lineHeight: 1.6 }}>
          An alert banner fires automatically when your total spending for today exceeds this amount.
          Set to <strong style={{ color: "#f97316" }}>0</strong> to disable.
        </p>
      </Panel>

      {/* Preferences */}
      <Panel className="fu3">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          🌐 Preferences
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Sel label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>JPY (¥)</option>
          </Sel>
          <Sel label="Theme" value="Dark" onChange={() => {}}>
            <option>Dark</option>
            <option disabled>Light (Coming Soon)</option>
          </Sel>
        </div>
      </Panel>

      {/* Notifications */}
      <Panel className="fu4">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          🔔 Notifications
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            ["daily",  "Daily Limit Alerts", "Show a banner when today's spending exceeds your daily limit"],
            ["weekly", "Weekly Summary",     "Get a spending summary every Sunday morning"],
            ["goals",  "Goal Milestones",    "Alert when you reach 50% and 100% of a savings goal"],
          ].map(([k, t, d]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: "#e2e8f0", marginBottom: 3 }}>{t}</div>
                <div style={{ fontSize: 12, color: "#4b5563" }}>{d}</div>
              </div>
              <Toggle on={notif[k]} onClick={() => setNotif((p) => ({ ...p, [k]: !p[k] }))} />
            </div>
          ))}
        </div>
      </Panel>

      {/* Danger zone */}
      <Panel className="fu5" style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>⚠️ Danger Zone</div>
        <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>
          These actions are permanent and cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="hov-btn"
            style={{ background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#ef4444", cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif" }}
          >
            Clear All Expenses
          </button>
          <button
            className="hov-btn"
            style={{ background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#ef4444", cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif" }}
          >
            Delete Account
          </button>
        </div>
      </Panel>

      {/* Error */}
      {err && (
        <div style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,.08)", borderRadius: 10, padding: "10px 16px" }}>
          ⚠️ {err}
        </div>
      )}

      {/* Save */}
      <BtnP
        onClick={save}
        loading={saving}
        disabled={saving}
        style={{ alignSelf: "flex-start" }}
      >
        {saved ? "✓ Settings Saved!" : "Save Settings"}
      </BtnP>
    </div>
  );
};

export default SettingsPage;
