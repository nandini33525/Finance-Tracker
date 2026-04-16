// src/components/UI.jsx
import React from "react";

// ── Panel ─────────────────────────────────────────────────────────────────────
export const Panel = ({ children, style = {}, className = "", ...rest }) => (
  <div
    className={className}
    style={{
      background: "#0b0b1a",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 18,
      padding: "22px 24px",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

// ── Section heading ───────────────────────────────────────────────────────────
export const SectionTitle = ({ children, sub, style = {} }) => (
  <div style={style}>
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        color: "#f1f5f9",
        letterSpacing: "-.02em",
      }}
    >
      {children}
    </h2>
    {sub && (
      <p style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>{sub}</p>
    )}
  </div>
);

// ── Label ─────────────────────────────────────────────────────────────────────
export const Label = ({ children }) => (
  <label
    style={{
      display: "block",
      fontSize: 11,
      color: "#4b5563",
      marginBottom: 6,
      fontWeight: 600,
      letterSpacing: ".07em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </label>
);

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  color: "#f1f5f9",
  transition: "border-color .15s",
};

// ── Field (input) ─────────────────────────────────────────────────────────────
export const Field = ({ label, error, ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <input
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = "#f97316")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
      {...props}
    />
    {error && (
      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5 }}>⚠ {error}</p>
    )}
  </div>
);

// ── Sel (select) ──────────────────────────────────────────────────────────────
export const Sel = ({ label, children, ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <select
      style={{ ...inputStyle, background: "#0b0b1a" }}
      onFocus={(e) => (e.target.style.borderColor = "#f97316")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ── Primary button ────────────────────────────────────────────────────────────
export const BtnP = ({ children, style = {}, loading = false, ...props }) => (
  <button
    className="hov-btn"
    style={{
      background: "linear-gradient(135deg,#f97316,#dc6800)",
      border: "none",
      borderRadius: 11,
      padding: "12px 22px",
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      cursor: props.disabled ? "not-allowed" : "pointer",
      boxShadow: "0 4px 20px rgba(249,115,22,.3)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: props.disabled ? 0.7 : 1,
      ...style,
    }}
    {...props}
  >
    {loading ? <><span className="spinner" /> Processing…</> : children}
  </button>
);

// ── Ghost button ──────────────────────────────────────────────────────────────
export const BtnG = ({ children, style = {}, ...props }) => (
  <button
    className="hov-btn"
    style={{
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 11,
      padding: "12px 22px",
      fontSize: 14,
      color: "#94a3b8",
      cursor: "pointer",
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

// ── Danger button ─────────────────────────────────────────────────────────────
export const BtnDanger = ({ children, style = {}, ...props }) => (
  <button
    className="hov-btn"
    style={{
      background: "linear-gradient(135deg,#ef4444,#b91c1c)",
      border: "none",
      borderRadius: 11,
      padding: "12px 22px",
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(239,68,68,.3)",
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, maxW = 480 }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 300,
      padding: 20,
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="modal-wrap"
      style={{
        background: "#0b0b1a",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 22,
        padding: "28px 32px",
        width: "100%",
        maxWidth: maxW,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: "#f1f5f9",
          }}
        >
          {title}
        </h3>
        <button
          className="icon-b"
          onClick={onClose}
          style={{ color: "#4b5563", fontSize: 18 }}
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── Alert banner ──────────────────────────────────────────────────────────────
export const AlertBanner = ({ msg, onClose }) => (
  <div
    className="alert-wrap"
    style={{
      position: "fixed",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 400,
      background: "linear-gradient(135deg,#ef4444,#b91c1c)",
      borderRadius: 14,
      padding: "14px 22px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 8px 40px rgba(239,68,68,.45)",
      minWidth: 320,
      maxWidth: 500,
    }}
  >
    <span style={{ fontSize: 20 }}>⚠️</span>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#fff" }}>
      {msg}
    </span>
    <button
      onClick={onClose}
      style={{
        background: "rgba(255,255,255,.2)",
        border: "none",
        borderRadius: 8,
        padding: "4px 10px",
        color: "#fff",
        cursor: "pointer",
        fontSize: 12,
      }}
    >
      ✕
    </button>
  </div>
);

// ── Donut chart ───────────────────────────────────────────────────────────────
export const DonutChart = ({ data = [], size = 150 }) => {
  const total = data.reduce((s, d) => s + d.v, 0) || 1;
  let off = 0;
  const r = size * 0.38, cx = size / 2, cy = size / 2;
  const sw = size * 0.15, circ = 2 * Math.PI * r;

  return (
    <svg width={size} height={size}>
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(255,255,255,.05)" strokeWidth={sw}
      />
      {data.map((d) => {
        const pct  = d.v / total;
        const dash = circ * pct;
        const gap  = circ * (1 - pct);
        const el   = (
          <circle
            key={d.l} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.c} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-circ * off}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray .5s" }}
          />
        );
        off += pct;
        return el;
      })}
    </svg>
  );
};

// ── Page-level loading spinner ────────────────────────────────────────────────
export const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid rgba(249,115,22,.2)",
        borderTopColor: "#f97316",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <p style={{ color: "#4b5563", fontSize: 14 }}>Loading…</p>
  </div>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
export const Toggle = ({ on, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: on ? "#f97316" : "rgba(255,255,255,.1)",
      cursor: "pointer", position: "relative", transition: "background .2s",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute", top: 3,
        left: on ? 22 : 3, width: 18, height: 18,
        borderRadius: "50%", background: "#fff",
        transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,.3)",
      }}
    />
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
export const Empty = ({ icon = "📭", message, action, onAction }) => (
  <div
    style={{
      textAlign: "center",
      padding: "48px 24px",
      color: "#1e293b",
    }}
  >
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <p style={{ fontSize: 14, color: "#334155" }}>{message}</p>
    {action && (
      <button
        onClick={onAction}
        style={{
          marginTop: 14,
          background: "none",
          border: "none",
          color: "#f97316",
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "'Instrument Sans', sans-serif",
        }}
      >
        {action}
      </button>
    )}
  </div>
);
