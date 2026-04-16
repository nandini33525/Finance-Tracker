// src/pages/AnalyticsPage.jsx
import React, { useState } from "react";
import { Panel, SectionTitle, DonutChart } from "../components/UI";
import { fmt } from "../utils/formatters";
import { CAT_COLORS, CAT_ICONS, CATEGORIES } from "../constants/categories";

const AnalyticsPage = ({ expenses }) => {
  const [period, setPeriod] = useState("month");
  const now = new Date();

  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    if (period === "week")  return (now - d) / 86400000 <= 7;
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear();
  });

  const total  = filtered.reduce((s, e) => s + e.amount, 0);
  const bycat  = CATEGORIES.map((c) => ({ l: c, v: filtered.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0), c: CAT_COLORS[c] })).filter((d) => d.v > 0);
  const maxC   = Math.max(...bycat.map((d) => d.v), 1);
  const mths   = Array.from({ length: 6 }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1); return { label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), month: d.getMonth() }; });
  const mT     = mths.map((m) => expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === m.month && d.getFullYear() === m.year; }).reduce((s, e) => s + e.amount, 0));
  const maxM   = Math.max(...mT, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle sub="Visual breakdown of your spending">Analytics</SectionTitle>
        <div style={{ display: "flex", gap: 6 }}>
          {["week", "month", "year"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{ background: period === p ? "rgba(249,115,22,.15)" : "rgba(255,255,255,.04)", border: `1px solid ${period === p ? "#f97316" : "rgba(255,255,255,.08)"}`, borderRadius: 20, padding: "6px 16px", fontSize: 12, color: period === p ? "#f97316" : "#64748b", cursor: "pointer", textTransform: "capitalize", fontFamily: "'Instrument Sans',sans-serif" }}>{p}</button>
          ))}
        </div>
      </div>

      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[["Total Spent", fmt(total), "#f97316"], ["Transactions", filtered.length, "#3b82f6"], ["Avg / Entry", fmt(Math.round(filtered.length ? total / filtered.length : 0)), "#a855f7"]].map(([l, v, c]) => (
          <Panel key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#475569", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{l}</div><div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div></Panel>
        ))}
      </div>

      <div className="fu3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 18, fontFamily: "'Bricolage Grotesque',sans-serif" }}>Category Breakdown</div>
          {bycat.length === 0 ? <p style={{ color: "#1e293b", fontSize: 13 }}>No data for this period</p> : bycat.sort((a, b) => b.v - a.v).map((d) => (
            <div key={d.l} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#cbd5e1" }}>{CAT_ICONS[d.l]} {d.l}</span>
                <span style={{ color: d.c, fontWeight: 600 }}>{fmt(d.v)}</span>
              </div>
              <div style={{ height: 7, background: "rgba(255,255,255,.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(d.v / maxC) * 100}%`, background: `linear-gradient(90deg,${d.c},${d.c}aa)`, borderRadius: 4, transition: "width .6s" }} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 16, fontFamily: "'Bricolage Grotesque',sans-serif", alignSelf: "flex-start" }}>Spending Share</div>
          {bycat.length > 0 ? (<><DonutChart data={bycat} size={150} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, justifyContent: "center" }}>
              {bycat.map((d) => <div key={d.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94a3b8" }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: d.c }} />{d.l}</div>)}
            </div></>) : <div style={{ flex: 1, display: "flex", alignItems: "center", color: "#1e293b", fontSize: 13 }}>No data</div>}
        </Panel>
      </div>

      <Panel className="fu4">
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 20, fontFamily: "'Bricolage Grotesque',sans-serif" }}>Monthly Trend — Last 6 Months</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
          {mths.map((m, i) => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 9, color: "#4b5563" }}>{mT[i] > 0 ? fmt(mT[i]) : ""}</div>
              <div style={{ width: "100%", borderRadius: "5px 5px 0 0", background: i === 5 ? "linear-gradient(180deg,#f97316,#dc6800)" : "rgba(255,255,255,.07)", height: `${Math.max(6, (mT[i] / maxM) * 96)}px`, transition: "height .5s", minHeight: 6 }} />
              <div style={{ fontSize: 11, color: "#4b5563" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export { AnalyticsPage };

// ═══════════════════════════════════════════════════════════════════════════════
// INSIGHTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const InsightsPage = ({ expenses }) => {
  const total  = expenses.reduce((s, e) => s + e.amount, 0);
  const bycat  = CATEGORIES.map((c) => ({ cat: c, amt: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) })).filter((d) => d.amt > 0).sort((a, b) => b.amt - a.amt);
  const top    = bycat[0];
  const months = [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().slice(-3);
  const mSpend = months.map((m) => expenses.filter((e) => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0));
  const trend  = mSpend.length >= 2 ? mSpend[mSpend.length - 1] - mSpend[mSpend.length - 2] : 0;

  const CARDS = [
    { icon: "🔥", t: "Top Spend Category",  d: `Your highest category is ${top?.cat || "–"} at ${fmt(top?.amt || 0)}. Setting a weekly sub-limit can reduce this by 20–30%.`, c: "#f97316", tag: "Spending" },
    { icon: trend > 0 ? "📈" : "📉", t: trend > 0 ? "Spending Rose" : "Spending Fell", d: trend > 0 ? `You spent ${fmt(Math.abs(trend))} more vs last month.` : `You spent ${fmt(Math.abs(trend))} less. Keep it up!`, c: trend > 0 ? "#ef4444" : "#10b981", tag: "Trend" },
    { icon: "💡", t: "Diversification",     d: `${bycat.length} spending categories tracked. Reducing Entertainment and subscriptions can free 15–20% of monthly budget.`, c: "#3b82f6", tag: "Tip" },
    { icon: "🎯", t: "Savings Potential",   d: `Cutting ${top?.cat || "top category"} by 20% saves ${fmt(Math.round((top?.amt || 0) * .2))}/mo — ${fmt(Math.round((top?.amt || 0) * .2 * 12))}/year.`, c: "#a855f7", tag: "Savings" },
    { icon: "⚡", t: "Utilities Watch",     d: "Consistent utility bills are healthy. Sudden spikes often signal fixable inefficiencies.", c: "#10b981", tag: "Utilities" },
    { icon: "📊", t: "50-30-20 Rule",       d: "Needs 50%, Wants 30%, Savings 20%. Measure your spending against this framework to find imbalances fast.", c: "#f59e0b", tag: "Framework" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle className="fu" sub="Smart analysis of your financial habits">Insights</SectionTitle>
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[["Total Tracked", fmt(total), "#f97316"], ["This Month", fmt(mSpend[mSpend.length - 1] || 0), "#3b82f6"], ["vs Last Month", (trend >= 0 ? "+" : "") + fmt(trend), trend <= 0 ? "#10b981" : "#ef4444"]].map(([l, v, c]) => (
          <Panel key={l}><div style={{ fontSize: 10, color: "#475569", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{l}</div><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div></Panel>
        ))}
      </div>
      <div className="fu3" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {CARDS.map((c, i) => (
          <Panel key={i} className="hov-card" style={{ borderLeft: `3px solid ${c.c}`, background: `linear-gradient(135deg,${c.c}07,#0b0b1a)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{c.icon}</span>
              <span style={{ fontSize: 10, background: `${c.c}22`, color: c.c, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>{c.tag}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", marginBottom: 7 }}>{c.t}</div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{c.d}</p>
          </Panel>
        ))}
      </div>
      <Panel className="fu4" style={{ background: "linear-gradient(135deg,rgba(16,185,129,.07),rgba(5,150,105,.04))", border: "1px solid rgba(16,185,129,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#6ee7b7", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Financial Health Score</div>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#10b981" }}>72 <span style={{ fontSize: 15, color: "#4b5563" }}>/ 100</span></div>
            <p style={{ fontSize: 13, color: "#4b5563", marginTop: 5 }}>Good! Reduce impulsive buys to reach 85+</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
            {[["Consistency", "85%", "#10b981"], ["Budget Adherence", "68%", "#f59e0b"], ["Savings Rate", "60%", "#3b82f6"]].map(([l, v, c]) => (
              <div key={l}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}><span>{l}</span><span style={{ color: c }}>{v}</span></div>
              <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2 }}><div style={{ height: "100%", width: v, background: c, borderRadius: 2, transition: "width .6s" }} /></div></div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
};

export { InsightsPage };

// ═══════════════════════════════════════════════════════════════════════════════
// GOALS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const GoalsPage = ({ goals, loading, addGoal, deleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name: "", total: "", saved: "", monthly: "", category: "Savings" });
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const F = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.total || !form.monthly) { setFormErr("Name, target and monthly savings are required"); return; }
    setSaving(true);
    const result = await addGoal({ ...form, total: +form.total, saved: +form.saved || 0, monthly: +form.monthly });
    setSaving(false);
    if (result.success) { setShowForm(false); setForm({ name: "", total: "", saved: "", monthly: "", category: "Savings" }); setFormErr(""); }
    else setFormErr(result.message);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle sub="Set and track your financial goals">Goals</SectionTitle>
        <button className="hov-btn" onClick={() => setShowForm(true)} style={{ background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.3)" }}>+ New Goal</button>
      </div>

      {goals.map((g) => {
        const rem   = g.total - g.saved;
        const ml    = rem > 0 && g.monthly > 0 ? Math.ceil(rem / g.monthly) : 0;
        const pct   = Math.min(100, Math.round((g.saved / g.total) * 100));
        const color = pct >= 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#f97316";
        const eta   = ml > 0 ? new Date(new Date().setMonth(new Date().getMonth() + ml)).toLocaleString("default", { month: "long", year: "numeric" }) : "";
        return (
          <Panel key={g._id} className="fu2 hov-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{CAT_ICONS[g.category] || "🎯"}</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9" }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Target: <strong style={{ color: "#f97316" }}>{fmt(g.total)}</strong> · Saved: <strong style={{ color: "#10b981" }}>{fmt(g.saved)}</strong></div>
                </div>
              </div>
              <button className="icon-b" onClick={() => deleteGoal(g._id)} style={{ color: "#ef4444" }}>🗑️</button>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 5, transition: "width .7s ease" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[["Progress", `${pct}%`, color], ["Monthly", fmt(g.monthly), "#3b82f6"], ["Months Left", ml === 0 ? "🎉" : ml, ml === 0 ? "#10b981" : "#f97316"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "12px 8px" }}>
                  <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div>
                </div>
              ))}
            </div>
            {ml > 0 && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 10, fontSize: 13, color: "#64748b" }}>💬 At {fmt(g.monthly)}/month → goal reached in <strong style={{ color: "#f97316" }}>{ml} month{ml !== 1 ? "s" : ""}</strong> — <strong style={{ color: "#f1f5f9" }}>{eta}</strong></div>}
          </Panel>
        );
      })}

      {goals.length === 0 && !loading && <Panel style={{ textAlign: "center", padding: "50px 24px", color: "#1e293b", fontSize: 14 }}>No goals yet. <span style={{ color: "#f97316", cursor: "pointer" }} onClick={() => setShowForm(true)}>Create your first →</span></Panel>}

      {showForm && (
        <Modal title="New Goal" onClose={() => { setShowForm(false); setFormErr(""); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[["Goal Name", "name", "text", "e.g. Emergency Fund"], ["Target Amount (₹)", "total", "number", "100000"], ["Already Saved (₹)", "saved", "number", "0"], ["Monthly Savings (₹)", "monthly", "number", "5000"]].map(([label, key, type, ph]) => (
              <div key={key}><label style={{ display: "block", fontSize: 11, color: "#4b5563", marginBottom: 6, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={(e) => F(key, e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }} /></div>
            ))}
            <div><label style={{ display: "block", fontSize: 11, color: "#4b5563", marginBottom: 6, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>Category</label>
            <select value={form.category} onChange={(e) => F("category", e.target.value)} style={{ width: "100%", background: "#0b0b1a", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }}>
              {["Savings","Food","Transport","Entertainment","Utilities","Health","Education","Shopping","Other"].map((c) => <option key={c} value={c}>{CAT_ICONS[c] || "💰"} {c}</option>)}
            </select></div>
            {form.total && form.monthly && +form.monthly > 0 && <div style={{ padding: "12px 14px", background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.2)", borderRadius: 12, fontSize: 13, color: "#f97316" }}>🎯 Estimated: <strong>{Math.ceil((+form.total - (+form.saved || 0)) / +form.monthly)} months</strong></div>}
            {formErr && <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", borderRadius: 9, padding: "10px 14px" }}>⚠️ {formErr}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="hov-btn" onClick={() => setShowForm(false)} style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "12px", fontSize: 14, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
              <button className="hov-btn" onClick={handleSubmit} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "12px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>{saving ? "Saving…" : "Save Goal"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { GoalsPage };

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsPage = ({ dailyLimit, updateProfile, user }) => {
  const [lim,    setLim]    = useState(dailyLimit || "");
  const [notif,  setNotif]  = useState(user?.notifications || { daily: true, weekly: false, goals: true });
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#f97316" : "rgba(255,255,255,.1)", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
    </div>
  );

  const save = async () => {
    setSaving(true);
    await updateProfile({ dailyLimit: +lim || 0, notifications: notif });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
      <SectionTitle className="fu" sub="Configure your preferences">Settings</SectionTitle>
      <Panel className="fu2">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 16 }}>💰 Budget Limits</div>
        <div><label style={{ display: "block", fontSize: 11, color: "#4b5563", marginBottom: 6, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>Daily Spending Limit (₹)</label>
        <input type="number" placeholder="e.g. 1500" value={lim} onChange={(e) => setLim(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }} />
        <p style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>An alert fires when today's spending exceeds this amount.</p></div>
      </Panel>
      <Panel className="fu3">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 16 }}>🔔 Notifications</div>
        {[["daily", "Daily Limit Alerts", "Notify when daily budget exceeded"], ["weekly", "Weekly Summary", "Spending summary every Sunday"], ["goals", "Goal Milestones", "Alert at 50% and 100% of goal"]].map(([k, t, d]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div><div style={{ fontSize: 14, color: "#e2e8f0", marginBottom: 2 }}>{t}</div><div style={{ fontSize: 12, color: "#4b5563" }}>{d}</div></div>
            <Toggle on={notif[k]} onClick={() => setNotif((p) => ({ ...p, [k]: !p[k] }))} />
          </div>
        ))}
      </Panel>
      <Panel className="fu4" style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.15)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", marginBottom: 12 }}>⚠️ Danger Zone</div>
        <button className="hov-btn" style={{ background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#ef4444", cursor: "pointer" }}>Clear All Expenses</button>
      </Panel>
      <button className="hov-btn" onClick={save} disabled={saving} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.3)" }}>
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
};

export { SettingsPage };

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ProfilePage = ({ user, updateProfile, changePassword, onLogout }) => {
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", dob: user?.dob || "", city: user?.city || "", country: user?.country || "India" });
  const [pw,      setPw]      = useState({ cur: "", newP: "", conf: "" });
  const [pSaved,  setPSaved]  = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwErr,   setPwErr]   = useState("");
  const [pErr,    setPErr]    = useState("");
  const [pSaving, setPSaving] = useState(false);
  const [pwSaving,setPwSaving]= useState(false);

  const saveProfile = async () => {
    setPSaving(true); setPErr("");
    const res = await updateProfile(profile);
    setPSaving(false);
    if (res.success) { setPSaved(true); setTimeout(() => setPSaved(false), 2000); }
    else setPErr(res.message);
  };

  const savePw = async () => {
    setPwErr("");
    if (!pw.cur || !pw.newP || !pw.conf) { setPwErr("All fields required"); return; }
    if (pw.newP !== pw.conf)             { setPwErr("Passwords don't match"); return; }
    if (pw.newP.length < 6)              { setPwErr("Min 6 characters"); return; }
    setPwSaving(true);
    const res = await changePassword(pw.cur, pw.newP);
    setPwSaving(false);
    if (res.success) { setPwSaved(true); setPw({ cur: "", newP: "", conf: "" }); setTimeout(() => setPwSaved(false), 2000); }
    else setPwErr(res.message);
  };

  const sc = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const sl = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = (p) => { if (!p) return 0; let s = 0; if (p.length >= 6) s++; if (p.length >= 10) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9!@#$%]/.test(p)) s++; return Math.min(s, 4); };
  const ps = strength(pw.newP);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
      <SectionTitle className="fu" sub="Manage your account">Profile</SectionTitle>
      <Panel className="fu2" style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{(profile.name || "U").charAt(0).toUpperCase()}</div>
        <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9" }}>{profile.name}</div>
        <div style={{ fontSize: 13, color: "#4b5563", marginTop: 3 }}>{profile.email}</div>
        <div style={{ fontSize: 11, background: "rgba(249,115,22,.15)", color: "#f97316", borderRadius: 12, padding: "2px 10px", display: "inline-block", marginTop: 7 }}>Pro Plan</div></div>
      </Panel>
      <Panel className="fu3">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 16 }}>👤 Personal Info</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[["Full Name","name","text",""],["Email","email","email",""],["Phone","phone","tel","+91 00000 00000"],["Date of Birth","dob","date",""],["City","city","text","Ghaziabad"],["Country","country","text","India"]].map(([l,k,t,ph]) => (
            <div key={k}><label style={{ display: "block", fontSize: 11, color: "#4b5563", marginBottom: 6, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>{l}</label>
            <input type={t} placeholder={ph} value={profile[k]} onChange={(e) => setProfile((p) => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }} /></div>
          ))}
        </div>
        {pErr && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 10 }}>⚠️ {pErr}</div>}
        <button className="hov-btn" onClick={saveProfile} disabled={pSaving} style={{ marginTop: 18, background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.3)" }}>
          {pSaving ? "Saving…" : pSaved ? "✓ Saved!" : "Save Profile"}
        </button>
      </Panel>
      <Panel className="fu4">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 16 }}>🔒 Change Password</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[["Current Password","cur"],["New Password","newP"],["Confirm Password","conf"]].map(([l,k]) => (
            <div key={k}><label style={{ display: "block", fontSize: 11, color: "#4b5563", marginBottom: 6, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>{l}</label>
            <input type="password" placeholder="••••••••" value={pw[k]} onChange={(e) => setPw((p) => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }} />
            {k === "newP" && pw.newP && <div style={{ marginTop: 8 }}><div style={{ display: "flex", gap: 4, marginBottom: 4 }}>{[1,2,3,4].map((i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: ps >= i ? sc[ps] : "rgba(255,255,255,.06)", transition: "background .3s" }} />)}</div><span style={{ fontSize: 11, color: sc[ps] }}>{sl[ps]}</span></div>}
            </div>
          ))}
          {pwErr && <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", borderRadius: 9, padding: "10px 14px" }}>⚠️ {pwErr}</div>}
          <button className="hov-btn" onClick={savePw} disabled={pwSaving} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.3)" }}>
            {pwSaving ? "Updating…" : pwSaved ? "✓ Updated!" : "Update Password"}
          </button>
        </div>
      </Panel>
      <Panel className="fu5" style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 3 }}>Sign Out</div><div style={{ fontSize: 13, color: "#4b5563" }}>You'll be returned to the login screen.</div></div>
          <button className="hov-btn" onClick={onLogout} style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", border: "none", borderRadius: 11, padding: "10px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(239,68,68,.3)" }}>🚪 Logout</button>
        </div>
      </Panel>
    </div>
  );
};

export { ProfilePage };
export default AnalyticsPage;
