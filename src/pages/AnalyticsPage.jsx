// src/pages/AnalyticsPage.jsx
import React, { useState } from "react";
import { Panel, SectionTitle, DonutChart, Empty } from "../components/UI";
import { fmt } from "../utils/formatters";
import { CAT_COLORS, CAT_ICONS, CATEGORIES } from "../constants/categories";

const AnalyticsPage = ({ expenses }) => {
  const [period, setPeriod] = useState("month");
  const now = new Date();

  // ── Filter by selected period ─────────────────────────────────────────────
  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    if (period === "week")  return (now - d) / 86400000 <= 7;
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear();
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const avg   = filtered.length ? Math.round(total / filtered.length) : 0;

  // ── Category breakdown ────────────────────────────────────────────────────
  const bycat = CATEGORIES
    .map((c) => ({ l: c, v: filtered.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0), c: CAT_COLORS[c] }))
    .filter((d) => d.v > 0)
    .sort((a, b) => b.v - a.v);
  const maxC = Math.max(...bycat.map((d) => d.v), 1);

  // ── Monthly trend (last 6 months) ─────────────────────────────────────────
  const mths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), month: d.getMonth() };
  });
  const mT   = mths.map((m) =>
    expenses
      .filter((e) => { const d = new Date(e.date); return d.getMonth() === m.month && d.getFullYear() === m.year; })
      .reduce((s, e) => s + e.amount, 0)
  );
  const maxM = Math.max(...mT, 1);

  const PeriodBtn = ({ p }) => (
    <button
      onClick={() => setPeriod(p)}
      style={{
        background: period === p ? "rgba(249,115,22,.15)" : "rgba(255,255,255,.04)",
        border: `1px solid ${period === p ? "#f97316" : "rgba(255,255,255,.08)"}`,
        borderRadius: 20, padding: "6px 16px", fontSize: 12,
        color: period === p ? "#f97316" : "#64748b",
        cursor: "pointer", textTransform: "capitalize",
        fontFamily: "'Instrument Sans',sans-serif",
      }}
    >
      {p}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle sub="Visual breakdown of your spending patterns">Analytics</SectionTitle>
        <div style={{ display: "flex", gap: 6 }}>
          <PeriodBtn p="week" />
          <PeriodBtn p="month" />
          <PeriodBtn p="year" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          ["Total Spent",    fmt(total),          "#f97316"],
          ["Transactions",   filtered.length,     "#3b82f6"],
          ["Avg per Entry",  fmt(avg),             "#a855f7"],
        ].map(([l, v, c]) => (
          <Panel key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div>
          </Panel>
        ))}
      </div>

      {/* Category bars + Donut */}
      <div className="fu3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Bar chart */}
        <Panel>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 18, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
            Category Breakdown
          </div>
          {bycat.length === 0 ? (
            <Empty icon="📊" message="No data for this period" />
          ) : (
            bycat.map((d) => (
              <div key={d.l} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "#cbd5e1" }}>{CAT_ICONS[d.l]} {d.l}</span>
                  <span style={{ color: d.c, fontWeight: 600 }}>{fmt(d.v)}</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.v / maxC) * 100}%`, background: `linear-gradient(90deg,${d.c},${d.c}aa)`, borderRadius: 4, transition: "width .6s ease" }} />
                </div>
              </div>
            ))
          )}
        </Panel>

        {/* Donut chart */}
        <Panel style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 16, fontFamily: "'Bricolage Grotesque',sans-serif", alignSelf: "flex-start" }}>
            Spending Share
          </div>
          {bycat.length > 0 ? (
            <>
              <DonutChart data={bycat} size={150} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, justifyContent: "center" }}>
                {bycat.map((d) => (
                  <div key={d.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94a3b8" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.c }} />
                    {d.l}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", color: "#1e293b", fontSize: 13 }}>
              No data for this period
            </div>
          )}
        </Panel>
      </div>

      {/* Monthly trend bar chart */}
      <Panel className="fu4">
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 20, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
          Monthly Trend — Last 6 Months
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {mths.map((m, i) => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 9, color: "#4b5563", textAlign: "center" }}>
                {mT[i] > 0 ? fmt(mT[i]) : ""}
              </div>
              <div
                style={{
                  width: "100%", borderRadius: "5px 5px 0 0",
                  background: i === 5 ? "linear-gradient(180deg,#f97316,#dc6800)" : "rgba(255,255,255,.07)",
                  height: `${Math.max(6, (mT[i] / maxM) * 110)}px`,
                  transition: "height .5s ease", minHeight: 6,
                }}
              />
              <div style={{ fontSize: 11, color: "#4b5563" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Top 3 spending days */}
      <Panel className="fu5">
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 16, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
          Highest Spending Days
        </div>
        {(() => {
          const byDay = {};
          filtered.forEach((e) => { byDay[e.date] = (byDay[e.date] || 0) + e.amount; });
          const sorted = Object.entries(byDay).sort((a, b) => b[1] - a[1]).slice(0, 5);
          return sorted.length === 0 ? (
            <Empty icon="📅" message="No data for this period" />
          ) : (
            sorted.map(([date, amt], i) => (
              <div key={date} className="hov-row" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 4px", borderTop: i > 0 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(249,115,22,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#f97316", flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "#e2e8f0" }}>{date}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f97316" }}>{fmt(amt)}</div>
              </div>
            ))
          );
        })()}
      </Panel>
    </div>
  );
};

export default AnalyticsPage;
