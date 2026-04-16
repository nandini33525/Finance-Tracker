// src/components/Sidebar.jsx
import React from "react";
import { fmt } from "../utils/formatters";

const NAV_ITEMS = [
  { id: "dashboard",  icon: "🏠", label: "Dashboard"  },
  { id: "expenses",   icon: "💸", label: "Expenses"   },
  { id: "analytics",  icon: "📊", label: "Analytics"  },
  { id: "insights",   icon: "💡", label: "Insights"   },
  { id: "goals",      icon: "🎯", label: "Goals"      },
  { id: "settings",   icon: "⚙️", label: "Settings"   },
  { id: "profile",    icon: "👤", label: "Profile"    },
];

const Sidebar = ({ page, setPage, user, total = 0, isPreview = false }) => (
  <aside
    style={{
      width: 224,
      background: "#090914",
      borderRight: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      flexDirection: "column",
      padding: "22px 0",
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
    }}
  >
    {/* Logo */}
    <div
      style={{
        padding: "0 18px 22px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 34, height: 34,
          background: "linear-gradient(135deg,#f97316,#dc6800)",
          borderRadius: 11,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: "#fff",
        }}
      >
        ₹
      </div>
      <span
        style={{
          fontSize: 18, fontWeight: 800,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          color: "#f1f5f9",
        }}
      >
        Finwise
      </span>
      {isPreview && (
        <span
          style={{
            fontSize: 9,
            background: "rgba(168,85,247,.2)",
            color: "#a855f7",
            borderRadius: 8,
            padding: "2px 6px",
            fontWeight: 700,
          }}
        >
          PREVIEW
        </span>
      )}
    </div>

    {/* Balance pill */}
    <div
      style={{
        margin: "14px 12px",
        background: "rgba(249,115,22,.08)",
        border: "1px solid rgba(249,115,22,.14)",
        borderRadius: 13,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 9, color: "#f97316",
          letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 4,
        }}
      >
        Total Tracked
      </div>
      <div
        style={{
          fontSize: 18, fontWeight: 800,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          color: "#f97316",
        }}
      >
        {fmt(total)}
      </div>
    </div>

    {/* Nav items */}
    <nav
      style={{
        flex: 1,
        padding: "4px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto",
      }}
    >
      {NAV_ITEMS.map((n) => {
        const active = page === n.id;
        return (
          <div
            key={n.id}
            className="hov-nav"
            onClick={() => setPage(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              color: active ? "#f97316" : "#4b5563",
              fontWeight: active ? 600 : 400,
              fontSize: 13,
              background: active ? "rgba(249,115,22,.09)" : "transparent",
              borderLeft: active ? "2px solid #f97316" : "2px solid transparent",
            }}
          >
            <span style={{ fontSize: 15 }}>{n.icon}</span>
            {n.label}
          </div>
        );
      })}
    </nav>

    {/* User footer */}
    <div
      style={{
        padding: "14px 16px",
        borderTop: "1px solid rgba(255,255,255,.06)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      }}
      onClick={() => setPage("profile")}
    >
      <div
        style={{
          width: 32, height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#f97316,#a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}
      >
        {(user?.name || "U").charAt(0).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 12, fontWeight: 600, color: "#e2e8f0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
        >
          {user?.name || "User"}
        </div>
        <div style={{ fontSize: 10, color: "#4b5563" }}>
          {isPreview ? "Preview Mode" : "Pro Plan"}
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
