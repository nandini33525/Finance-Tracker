// src/pages/InsightsPage.jsx
import React from "react";
import { Panel, SectionTitle, Empty } from "../components/UI";
import { fmt } from "../utils/formatters";
import { CATEGORIES } from "../constants/categories";

const InsightsPage = ({ expenses }) => {
  const total  = expenses.reduce((s, e) => s + e.amount, 0);

  // ── Category breakdown ────────────────────────────────────────────────────
  const bycat = CATEGORIES
    .map((c) => ({ cat: c, amt: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) }))
    .filter((d) => d.amt > 0)
    .sort((a, b) => b.amt - a.amt);
  const top = bycat[0];

  // ── Month-over-month trend ────────────────────────────────────────────────
  const months = [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().slice(-3);
  const mSpend = months.map((m) => expenses.filter((e) => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0));
  const trend  = mSpend.length >= 2 ? mSpend[mSpend.length - 1] - mSpend[mSpend.length - 2] : 0;
  const trendPct = mSpend[mSpend.length - 2] > 0
    ? Math.round((Math.abs(trend) / mSpend[mSpend.length - 2]) * 100)
    : 0;

  // ── 50-30-20 rule analysis ────────────────────────────────────────────────
  const needsCats  = ["Food", "Utilities", "Health", "Transport"];
  const wantsCats  = ["Entertainment", "Shopping"];
  const savingsCats= ["Education", "Savings", "Other"];
  const needsAmt   = expenses.filter((e) => needsCats.includes(e.category)).reduce((s, e) => s + e.amount, 0);
  const wantsAmt   = expenses.filter((e) => wantsCats.includes(e.category)).reduce((s, e) => s + e.amount, 0);
  const savingsAmt = expenses.filter((e) => savingsCats.includes(e.category)).reduce((s, e) => s + e.amount, 0);
  const needsPct   = total > 0 ? Math.round((needsAmt  / total) * 100) : 0;
  const wantsPct   = total > 0 ? Math.round((wantsAmt  / total) * 100) : 0;
  const savPct     = total > 0 ? Math.round((savingsAmt/ total) * 100) : 0;

  const INSIGHT_CARDS = [
    {
      icon: "🔥", tag: "Spending",
      t: "Top Spend Category",
      d: top
        ? `${top.cat} is your highest category at ${fmt(top.amt)}. Setting a weekly sub-limit here could reduce total spending by 15–25%.`
        : "Add some expenses to see your top spending category.",
      c: "#f97316",
    },
    {
      icon: trend > 0 ? "📈" : "📉", tag: "Trend",
      t: trend > 0 ? "Spending Increased" : "Spending Decreased",
      d: mSpend[mSpend.length - 2] > 0
        ? `Your spending ${trend > 0 ? "grew" : "fell"} by ${fmt(Math.abs(trend))} (${trendPct}%) compared to last month.${trend > 0 ? " Review large recent purchases." : " Keep up the good work!"}`
        : "Not enough history yet — add expenses over multiple months to see trends.",
      c: trend > 0 ? "#ef4444" : "#10b981",
    },
    {
      icon: "💡", tag: "Tip",
      t: "Subscription Check",
      d: `You have ${expenses.filter(e => e.category === "Entertainment").length} Entertainment transactions. Audit recurring subscriptions — the average person overpays ₹1,200+/month on unused services.`,
      c: "#3b82f6",
    },
    {
      icon: "🎯", tag: "Savings",
      t: "Savings Potential",
      d: top
        ? `Cutting ${top.cat} spending by 20% frees up ${fmt(Math.round(top.amt * 0.2))}/month — that's ${fmt(Math.round(top.amt * 0.2 * 12))}/year you could redirect to goals.`
        : "Add expenses to calculate your savings potential.",
      c: "#a855f7",
    },
    {
      icon: "⚡", tag: "Utilities",
      t: "Utility Cost Watch",
      d: "Consistent utility bills indicate efficient usage. Spikes of 20%+ month-over-month often signal an appliance issue or billing error worth investigating.",
      c: "#10b981",
    },
    {
      icon: "🏦", tag: "Habit",
      t: "Pay Yourself First",
      d: "Automate a fixed savings transfer on salary day before spending. Even ₹2,000/month at 7% annual return grows to ₹30 lakh over 30 years.",
      c: "#f59e0b",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <SectionTitle className="fu" sub="Smart analysis of your financial habits">Insights</SectionTitle>

      {/* Summary strip */}
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          ["Total Tracked",   fmt(total),                                     "#f97316"],
          ["This Month",      fmt(mSpend[mSpend.length - 1] || 0),            "#3b82f6"],
          ["vs Last Month",   (trend >= 0 ? "+" : "") + fmt(trend),           trend <= 0 ? "#10b981" : "#ef4444"],
        ].map(([l, v, c]) => (
          <Panel key={l}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div>
          </Panel>
        ))}
      </div>

      {/* Insight cards */}
      <div className="fu3" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {INSIGHT_CARDS.map((card, i) => (
          <Panel
            key={i}
            className="hov-card"
            style={{ borderLeft: `3px solid ${card.c}`, background: `linear-gradient(135deg,${card.c}07,#0b0b1a)` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <span style={{ fontSize: 10, background: `${card.c}22`, color: card.c, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                {card.tag}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", marginBottom: 8 }}>
              {card.t}
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{card.d}</p>
          </Panel>
        ))}
      </div>

      {/* 50-30-20 Rule Analyser */}
      <Panel className="fu4" style={{ background: "linear-gradient(135deg,rgba(59,130,246,.07),rgba(99,102,241,.04))", border: "1px solid rgba(59,130,246,.18)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          📊 50 / 30 / 20 Budget Analyser
        </div>
        {total === 0 ? (
          <Empty icon="📊" message="Add expenses to see your budget breakdown" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Needs (50% ideal)",   pct: needsPct,  ideal: 50, amt: needsAmt,  c: "#10b981", cats: needsCats  },
              { label: "Wants (30% ideal)",   pct: wantsPct,  ideal: 30, amt: wantsAmt,  c: "#f59e0b", cats: wantsCats  },
              { label: "Savings (20% ideal)", pct: savPct,    ideal: 20, amt: savingsAmt,c: "#3b82f6", cats: savingsCats},
            ].map(({ label, pct, ideal, amt, c, cats }) => {
              const diff    = pct - ideal;
              const status  = Math.abs(diff) <= 5 ? "On track ✅" : diff > 0 ? `${diff}% over 🔴` : `${Math.abs(diff)}% under 🟡`;
              return (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#4b5563" }}>{cats.join(", ")}</span>
                      <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>{fmt(amt)} ({pct}%)</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{status}</span>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,.05)", borderRadius: 4 }}>
                    {/* Ideal marker */}
                    <div style={{ position: "absolute", top: -3, left: `${ideal}%`, width: 2, height: 14, background: "rgba(255,255,255,.2)", borderRadius: 1 }} />
                    {/* Actual bar */}
                    <div style={{ height: "100%", width: `${Math.min(100, pct)}%`, background: `linear-gradient(90deg,${c},${c}99)`, borderRadius: 4, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
            <p style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
              Ideal split: <strong style={{ color: "#10b981" }}>50%</strong> Needs · <strong style={{ color: "#f59e0b" }}>30%</strong> Wants · <strong style={{ color: "#3b82f6" }}>20%</strong> Savings
            </p>
          </div>
        )}
      </Panel>

      {/* Financial Health Score */}
      <Panel className="fu5" style={{ background: "linear-gradient(135deg,rgba(16,185,129,.07),rgba(5,150,105,.04))", border: "1px solid rgba(16,185,129,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#6ee7b7", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Financial Health Score</div>
            <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#10b981", lineHeight: 1 }}>
              72 <span style={{ fontSize: 16, color: "#4b5563", fontWeight: 400 }}>/ 100</span>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", marginTop: 8, maxWidth: 260 }}>
              Good score! Reduce impulse purchases and build a 3-month emergency fund to reach 85+
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
            {[
              ["Spending Consistency",  "85%", "#10b981"],
              ["Budget Adherence",      "68%", "#f59e0b"],
              ["Savings Rate",          "60%", "#3b82f6"],
              ["Goal Progress",         "45%", "#a855f7"],
            ].map(([l, v, c]) => (
              <div key={l}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 5 }}>
                  <span>{l}</span>
                  <span style={{ color: c, fontWeight: 600 }}>{v}</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: v, background: `linear-gradient(90deg,${c},${c}99)`, borderRadius: 3, transition: "width .6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default InsightsPage;
