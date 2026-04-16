// src/pages/DashboardPage.jsx
import React from "react";
import { Panel, DonutChart, Empty } from "../components/UI";
import { fmt, todayStr, monthStr, greeting, monthsLeft, completionDate } from "../utils/formatters";
import { CAT_COLORS, CAT_ICONS, CATEGORIES } from "../constants/categories";

const StatCard = ({ label, value, sub, color, icon, onClick }) => (
  <div
    className="hov-card"
    onClick={onClick}
    style={{
      background: `${color}0d`, border: `1px solid ${color}22`,
      borderRadius: 16, padding: "18px 20px",
      cursor: onClick ? "pointer" : "default",
      position: "relative", overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", top: -20, right: -20, fontSize: 60, opacity: .05 }}>{icon}</div>
    <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color, marginBottom: 4 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#4b5563" }}>{sub}</div>}
  </div>
);

const QuickLink = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{ fontSize: 11, color: "#f97316", background: "rgba(249,115,22,.1)", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif" }}
  >
    {label} →
  </button>
);

const DashboardPage = ({ expenses, goals, dailyLimit, user, onNavigate }) => {
  const td = todayStr();
  const tm = monthStr();

  const todayExp   = expenses.filter((e) => e.date === td);
  const monthExp   = expenses.filter((e) => e.date.startsWith(tm));
  const todaySpent = todayExp.reduce((s, e) => s + e.amount, 0);
  const monthTotal = monthExp.reduce((s, e) => s + e.amount, 0);
  const limitPct   = dailyLimit > 0 ? Math.min(100, (todaySpent / dailyLimit) * 100) : 0;
  const overLimit  = dailyLimit > 0 && todaySpent > dailyLimit;

  // Donut data
  const catData = CATEGORIES
    .map((c) => ({ l: c, v: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0), c: CAT_COLORS[c] }))
    .filter((d) => d.v > 0);
  const topCat = [...catData].sort((a, b) => b.v - a.v)[0];

  // Monthly bars (last 5)
  const now = new Date();
  const mths = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);
    return { label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), month: d.getMonth() };
  });
  const mTotals = mths.map((m) =>
    expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === m.month && d.getFullYear() === m.year; })
      .reduce((s, e) => s + e.amount, 0)
  );
  const maxM = Math.max(...mTotals, 1);

  // Insight trend
  const prev = mTotals[mTotals.length - 2] || 0;
  const curr = mTotals[mTotals.length - 1] || 0;
  const trendDiff = curr - prev;

  const activeGoals = goals.filter((g) => g.saved < g.total);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Welcome header */}
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", letterSpacing: "-.02em" }}>
            {greeting()}, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p style={{ fontSize: 14, color: "#4b5563", marginTop: 5 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          className="hov-btn"
          onClick={() => onNavigate("expenses")}
          style={{ background: "linear-gradient(135deg,#f97316,#dc6800)", border: "none", borderRadius: 11, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.3)" }}
        >
          + Add Expense
        </button>
      </div>

      {/* Stat cards */}
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <StatCard label="Today's Spending"  value={fmt(todaySpent)}          sub={dailyLimit > 0 ? `Limit: ${fmt(dailyLimit)}` : "No limit set"} color={overLimit ? "#ef4444" : "#f97316"} icon="💸" onClick={() => onNavigate("expenses")} />
        <StatCard label="This Month"        value={fmt(monthTotal)}          sub={`${monthExp.length} transactions`}                            color="#3b82f6"  icon="📅" onClick={() => onNavigate("analytics")} />
        <StatCard label="Active Goals"      value={activeGoals.length}       sub={activeGoals.length > 0 ? `Next: ${activeGoals[0]?.name}` : "All complete!"} color="#a855f7" icon="🎯" onClick={() => onNavigate("goals")} />
        <StatCard label="Top Category"      value={topCat ? `${CAT_ICONS[topCat.l]} ${topCat.l}` : "—"} sub={topCat ? fmt(topCat.v) : "No data yet"} color="#10b981" icon="📊" onClick={() => onNavigate("analytics")} />
      </div>

      {/* Daily limit bar */}
      {dailyLimit > 0 && (
        <div className="fu3" style={{ background: overLimit ? "rgba(239,68,68,.07)" : "rgba(249,115,22,.06)", border: `1px solid ${overLimit ? "rgba(239,68,68,.2)" : "rgba(249,115,22,.15)"}`, borderRadius: 16, padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
              Daily Limit Tracker
              {overLimit && <span style={{ marginLeft: 8, fontSize: 12, background: "rgba(239,68,68,.2)", color: "#ef4444", borderRadius: 20, padding: "2px 10px" }}>⚠️ Exceeded</span>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: overLimit ? "#ef4444" : "#f97316" }}>
              {fmt(todaySpent)} <span style={{ fontSize: 12, color: "#4b5563", fontWeight: 400 }}>/ {fmt(dailyLimit)}</span>
            </div>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${limitPct}%`, background: overLimit ? "linear-gradient(90deg,#ef4444,#b91c1c)" : "linear-gradient(90deg,#f97316,#dc6800)", borderRadius: 4, transition: "width .6s ease" }} />
          </div>
          {!overLimit && dailyLimit > todaySpent && (
            <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>{fmt(dailyLimit - todaySpent)} remaining today</div>
          )}
        </div>
      )}

      {/* Charts row */}
      <div className="fu4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Monthly trend */}
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8" }}>Monthly Trend</div>
            <QuickLink label="View All" onClick={() => onNavigate("analytics")} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
            {mths.map((m, i) => (
              <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: "100%", borderRadius: "5px 5px 0 0", background: i === 4 ? "linear-gradient(180deg,#f97316,#dc6800)" : "rgba(255,255,255,.06)", height: `${Math.max(6, (mTotals[i] / maxM) * 88)}px`, transition: "height .5s ease", minHeight: 6 }} />
                <div style={{ fontSize: 10, color: "#4b5563" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Donut */}
        <Panel style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8" }}>Spending Share</div>
            <QuickLink label="Details" onClick={() => onNavigate("analytics")} />
          </div>
          {catData.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DonutChart data={catData} size={110} />
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {[...catData].sort((a, b) => b.v - a.v).slice(0, 4).map((d) => (
                  <div key={d.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.c, display: "inline-block" }} />{d.l}
                    </span>
                    <span style={{ color: d.c, fontWeight: 600 }}>{fmt(d.v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty icon="📊" message="Add expenses to see your spending share" />
          )}
        </Panel>
      </div>

      {/* Goals + Insights row */}
      <div className="fu5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Goals summary */}
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8" }}>🎯 Goals</div>
            <QuickLink label="Manage" onClick={() => onNavigate("goals")} />
          </div>
          {goals.length === 0 ? (
            <Empty icon="🎯" message="No goals yet." action="Create one →" onAction={() => onNavigate("goals")} />
          ) : (
            goals.slice(0, 3).map((g) => {
              const pct   = Math.min(100, Math.round((g.saved / g.total) * 100));
              const ml    = monthsLeft(g.total, g.saved, g.monthly);
              const color = pct >= 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#f97316";
              return (
                <div key={g._id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                    <span style={{ color: "#cbd5e1" }}>{CAT_ICONS[g.category] || "🎯"} {g.name}</span>
                    <span style={{ color, fontWeight: 600 }}>{pct}%{ml > 0 && <span style={{ color: "#4b5563", fontWeight: 400, fontSize: 11 }}> · {ml}mo</span>}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.05)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 3, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })
          )}
        </Panel>

        {/* Insights snippet */}
        <Panel style={{ background: "linear-gradient(135deg,rgba(168,85,247,.07),rgba(59,130,246,.05))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8" }}>💡 Insights</div>
            <QuickLink label="Full Report" onClick={() => onNavigate("insights")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: "12px 14px", background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f97316", marginBottom: 4 }}>🔥 Top Spend</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{topCat ? `${topCat.l} is your biggest category at ${fmt(topCat.v)}.` : "Add expenses to see insights."}</div>
            </div>
            <div style={{ padding: "12px 14px", background: trendDiff > 0 ? "rgba(239,68,68,.07)" : "rgba(16,185,129,.07)", border: `1px solid ${trendDiff > 0 ? "rgba(239,68,68,.15)" : "rgba(16,185,129,.15)"}`, borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: trendDiff > 0 ? "#ef4444" : "#10b981", marginBottom: 4 }}>{trendDiff > 0 ? "📈 Spending Up" : "📉 Spending Down"}</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{prev > 0 ? `${trendDiff > 0 ? "Increased" : "Decreased"} by ${fmt(Math.abs(trendDiff))} vs last month.` : "Not enough data yet."}</div>
            </div>
            <div style={{ padding: "12px 14px", background: "rgba(59,130,246,.07)", border: "1px solid rgba(59,130,246,.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6", marginBottom: 4 }}>📊 Health Score</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#3b82f6" }}>72</div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>Good — room to improve</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Recent transactions */}
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8" }}>Recent Transactions</div>
          <QuickLink label="View All" onClick={() => onNavigate("expenses")} />
        </div>
        {expenses.length === 0 ? (
          <Empty icon="💸" message="No transactions yet." action="Add your first →" onAction={() => onNavigate("expenses")} />
        ) : (
          [...expenses]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5)
            .map((e, i) => (
              <div key={e._id} className="hov-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderTop: i > 0 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${CAT_COLORS[e.category]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{CAT_ICONS[e.category] || "📦"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{e.category} · {e.date}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{fmt(e.amount)}</div>
              </div>
            ))
        )}
      </Panel>
    </div>
  );
};

export default DashboardPage;
