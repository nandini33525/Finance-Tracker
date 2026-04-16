// src/pages/LandingPage.jsx
import React from "react";
import { BtnP, BtnG } from "../components/UI";

const FEATURES = [
  { icon: "📊", t: "Visual Analytics",   d: "Beautiful charts that break down exactly where your money goes, by category and by month." },
  { icon: "🎯", t: "Smart Goals",        d: "Set savings goals and see exactly how many months until you reach them — automatically calculated." },
  { icon: "💡", t: "AI Insights",        d: "Get personalised financial tips and a health score based on your real spending patterns." },
  { icon: "🚨", t: "Daily Limit Alerts", d: "Set a daily budget and get an instant alert the moment you exceed it." },
  { icon: "📱", t: "Full CRUD",          d: "Add, edit, and delete expenses instantly. Filter by category, sort by date or amount." },
  { icon: "🔒", t: "Secure & Private",   d: "Your data stays yours. JWT-secured accounts, zero ads, no third-party sharing." },
];

const TICKER = [
  "Track every rupee", "Set smart goals", "Beat your budget",
  "Know where it goes", "Build wealth faster", "Stay in control",
];

const MOCK_EXPENSES = [
  { cat: "Food",          icon: "🍜", t: "Grocery Store", d: "Today",     amt: "₹2,450" },
  { cat: "Transport",     icon: "🚗", t: "Uber Ride",     d: "Yesterday", amt: "₹380"   },
  { cat: "Entertainment", icon: "🎬", t: "Netflix",       d: "Apr 10",    amt: "₹649"   },
  { cat: "Health",        icon: "💪", t: "Gym",           d: "Apr 8",     amt: "₹1,200" },
];

const CAT_BADGE_COLORS = {
  Food: "#f97316", Transport: "#3b82f6", Entertainment: "#a855f7", Health: "#ec4899",
};

const LandingPage = ({ onGoAuth }) => (
  <div style={{ minHeight: "100vh", background: "#05050e", overflow: "hidden" }}>

    {/* ── Navbar ── */}
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(5,5,14,.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      padding: "0 5%", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#f97316,#dc6800)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>₹</div>
        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9" }}>Finwise</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <BtnG onClick={() => onGoAuth("login")}  style={{ padding: "9px 20px", fontSize: 13 }}>Sign In</BtnG>
        <BtnP onClick={() => onGoAuth("signup")} style={{ padding: "9px 20px", fontSize: 13 }}>Get Started Free</BtnP>
      </div>
    </nav>

    {/* ── Hero ── */}
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden",
    }}>
      {/* BG blobs */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle,rgba(249,115,22,.12),transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 350, height: 350, background: "radial-gradient(circle,rgba(168,85,247,.1),transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,.1)", border: "1px solid rgba(249,115,22,.25)", borderRadius: 40, padding: "6px 16px", fontSize: 12, color: "#f97316", fontWeight: 600, marginBottom: 28 }}>
        ✨ Your personal finance OS — built for clarity
      </div>

      <h1 className="fu2" style={{ fontSize: "clamp(42px,6vw,80px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f8fafc", lineHeight: 1.08, letterSpacing: "-.04em", marginBottom: 24, maxWidth: 800 }}>
        Know exactly where<br />
        <span style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>every rupee goes</span>
      </h1>

      <p className="fu3" style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
        Finwise turns your messy expenses into clear insights, smart goals, and a financial health score — all in one beautiful dashboard.
      </p>

      <div className="fu4" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 60 }}>
        <BtnP onClick={() => onGoAuth("signup")}  style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14 }}>Start Tracking Free →</BtnP>
        <BtnG onClick={() => onGoAuth("preview")} style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14 }}>See Live Preview</BtnG>
      </div>

      {/* Mock dashboard */}
      <div className="fu5 hov-card" style={{ width: "100%", maxWidth: 780, background: "#0b0b1a", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,.7)" }}>
        <div style={{ background: "#080814", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
          <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#334155" }}>finwise.app/dashboard</div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {[["Total Spent","₹7,429","#f97316"],["This Month","₹5,229","#3b82f6"],["Transactions","10","#a855f7"],["Top Category","🍜 Food","#10b981"]].map(([l,v,c]) => (
              <div key={l} style={{ background: `${c}10`, border: `1px solid ${c}22`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#475569", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {MOCK_EXPENSES.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 6px", borderTop: i > 0 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${CAT_BADGE_COLORS[e.cat]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{e.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>{e.t}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{e.cat} · {e.d}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{e.amt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── Ticker ── */}
    <div style={{ background: "#0b0b1a", borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "14px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 18s linear infinite", width: "max-content" }}>
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} style={{ whiteSpace: "nowrap", padding: "0 32px", fontSize: 13, color: "#334155", fontWeight: 500 }}>
            <span style={{ color: "#f97316", marginRight: 10 }}>✦</span>{t}
          </span>
        ))}
      </div>
    </div>

    {/* ── Features ── */}
    <section style={{ padding: "100px 5%", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ fontSize: 11, color: "#f97316", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>EVERYTHING YOU NEED</div>
        <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f8fafc", letterSpacing: "-.03em" }}>Finance tracking,<br />done right</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="hov-card" style={{ background: "#0b0b1a", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "28px 26px", boxShadow: "0 4px 24px rgba(0,0,0,.3)" }}>
            <div style={{ fontSize: 32, marginBottom: 14, display: "inline-block", background: "rgba(249,115,22,.1)", borderRadius: 12, padding: "8px 12px" }}>{f.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", marginBottom: 8 }}>{f.t}</div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{f.d}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section style={{ padding: "80px 5%", textAlign: "center" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(249,115,22,.08),rgba(168,85,247,.06))", border: "1px solid rgba(249,115,22,.15)", borderRadius: 28, padding: "60px 40px", maxWidth: 700, margin: "0 auto", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle,rgba(249,115,22,.15),transparent 70%)", borderRadius: "50%" }} />
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f8fafc", letterSpacing: "-.03em", marginBottom: 16 }}>Ready to take control?</h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32, lineHeight: 1.7 }}>Join thousands tracking smarter. Free forever, no card required.</p>
        <BtnP onClick={() => onGoAuth("signup")} style={{ padding: "15px 40px", fontSize: 16, borderRadius: 14 }}>Create Free Account →</BtnP>
      </div>
    </section>

    {/* ── Footer ── */}
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#f97316,#dc6800)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>₹</div>
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#475569" }}>Finwise</span>
      </div>
      <p style={{ fontSize: 12, color: "#1e293b" }}>Built with ♥ · MERN Stack · Your data, your control</p>
    </footer>
  </div>
);

export default LandingPage;
