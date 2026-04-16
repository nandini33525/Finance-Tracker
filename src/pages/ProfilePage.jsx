// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Panel, SectionTitle, Field, BtnP } from "../components/UI";

const ProfilePage = ({ user, updateProfile, changePassword, onLogout }) => {
  const [profile, setProfile] = useState({
    name:    user?.name    || "",
    email:   user?.email   || "",
    phone:   user?.phone   || "",
    dob:     user?.dob     || "",
    city:    user?.city    || "",
    country: user?.country || "India",
  });
  const [pw, setPw] = useState({ cur: "", newP: "", conf: "" });

  const [pSaving,  setPSaving]  = useState(false);
  const [pSaved,   setPSaved]   = useState(false);
  const [pErr,     setPErr]     = useState("");

  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved,  setPwSaved]  = useState(false);
  const [pwErr,    setPwErr]    = useState("");

  // Sync profile fields if user object updates (e.g. after another save)
  useEffect(() => {
    setProfile({
      name:    user?.name    || "",
      email:   user?.email   || "",
      phone:   user?.phone   || "",
      dob:     user?.dob     || "",
      city:    user?.city    || "",
      country: user?.country || "India",
    });
  }, [user]);

  // ── Save profile ──────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!profile.name.trim()) { setPErr("Name is required"); return; }
    setPSaving(true); setPErr("");
    const res = await updateProfile(profile);
    setPSaving(false);
    if (res.success) { setPSaved(true); setTimeout(() => setPSaved(false), 2500); }
    else setPErr(res.message || "Failed to save");
  };

  // ── Change password ───────────────────────────────────────────────────────
  const savePassword = async () => {
    setPwErr("");
    if (!pw.cur || !pw.newP || !pw.conf) { setPwErr("All fields are required"); return; }
    if (pw.newP !== pw.conf)             { setPwErr("Passwords do not match"); return; }
    if (pw.newP.length < 6)              { setPwErr("Password must be at least 6 characters"); return; }
    setPwSaving(true);
    const res = await changePassword(pw.cur, pw.newP);
    setPwSaving(false);
    if (res.success) {
      setPwSaved(true);
      setPw({ cur: "", newP: "", conf: "" });
      setTimeout(() => setPwSaved(false), 2500);
    } else {
      setPwErr(res.message || "Failed to update password");
    }
  };

  // ── Password strength ─────────────────────────────────────────────────────
  const strength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)           s++;
    if (p.length >= 10)          s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9!@#$%^&*]/.test(p)) s++;
    return Math.min(s, 4);
  };
  const STRENGTH_COLORS  = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const STRENGTH_LABELS  = ["", "Weak",    "Fair",    "Good",    "Strong" ];
  const ps = strength(pw.newP);

  const P = (k, v) => setProfile((prev) => ({ ...prev, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 620 }}>

      <SectionTitle className="fu" sub="Manage your personal information and security">Profile</SectionTitle>

      {/* Avatar card */}
      <Panel className="fu2" style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
          {(profile.name || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9" }}>
            {profile.name || "Your Name"}
          </div>
          <div style={{ fontSize: 13, color: "#4b5563", marginTop: 3 }}>{profile.email}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, background: "rgba(249,115,22,.15)", color: "#f97316", borderRadius: 12, padding: "2px 10px", fontWeight: 600 }}>Pro Plan</span>
            {profile.city && <span style={{ fontSize: 11, background: "rgba(255,255,255,.06)", color: "#64748b", borderRadius: 12, padding: "2px 10px" }}>📍 {profile.city}</span>}
          </div>
        </div>
      </Panel>

      {/* Personal information */}
      <Panel className="fu3">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          👤 Personal Information
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field
            label="Full Name"
            placeholder="Arjun Sharma"
            value={profile.name}
            onChange={(e) => P("name", e.target.value)}
          />
          <Field
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={profile.email}
            onChange={(e) => P("email", e.target.value)}
          />
          <Field
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={profile.phone}
            onChange={(e) => P("phone", e.target.value)}
          />
          <Field
            label="Date of Birth"
            type="date"
            value={profile.dob}
            onChange={(e) => P("dob", e.target.value)}
          />
          <Field
            label="City"
            placeholder="Ghaziabad"
            value={profile.city}
            onChange={(e) => P("city", e.target.value)}
          />
          <Field
            label="Country"
            placeholder="India"
            value={profile.country}
            onChange={(e) => P("country", e.target.value)}
          />
        </div>

        {pErr && (
          <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", borderRadius: 9, padding: "10px 14px", marginTop: 14 }}>
            ⚠️ {pErr}
          </div>
        )}

        <BtnP onClick={saveProfile} loading={pSaving} disabled={pSaving} style={{ marginTop: 18 }}>
          {pSaved ? "✓ Profile Saved!" : "Save Profile"}
        </BtnP>
      </Panel>

      {/* Change password */}
      <Panel className="fu4">
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#94a3b8", marginBottom: 18 }}>
          🔒 Change Password
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={pw.cur}
            onChange={(e) => setPw((p) => ({ ...p, cur: e.target.value }))}
          />

          <div>
            <Field
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              value={pw.newP}
              onChange={(e) => setPw((p) => ({ ...p, newP: e.target.value }))}
            />
            {pw.newP && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{ flex: 1, height: 4, borderRadius: 2, background: ps >= i ? STRENGTH_COLORS[ps] : "rgba(255,255,255,.06)", transition: "background .3s" }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: STRENGTH_COLORS[ps], fontWeight: 500 }}>
                  {STRENGTH_LABELS[ps]}
                  {ps < 3 && <span style={{ color: "#4b5563", fontWeight: 400 }}> — add uppercase letters and numbers to strengthen</span>}
                </div>
              </div>
            )}
          </div>

          <Field
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={pw.conf}
            onChange={(e) => setPw((p) => ({ ...p, conf: e.target.value }))}
          />

          {pwErr && (
            <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 9, padding: "10px 14px" }}>
              ⚠️ {pwErr}
            </div>
          )}
          {pwSaved && (
            <div style={{ fontSize: 12, color: "#10b981", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 9, padding: "10px 14px" }}>
              ✅ Password updated successfully!
            </div>
          )}

          <BtnP onClick={savePassword} loading={pwSaving} disabled={pwSaving} style={{ alignSelf: "flex-start" }}>
            {pwSaving ? "Updating…" : "Update Password"}
          </BtnP>
        </div>
      </Panel>

      {/* Logout */}
      <Panel className="fu5" style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Sign Out</div>
            <div style={{ fontSize: 13, color: "#4b5563" }}>
              Your data is safely stored and will be here when you log back in.
            </div>
          </div>
          <button
            className="hov-btn"
            onClick={onLogout}
            style={{
              background: "linear-gradient(135deg,#ef4444,#b91c1c)",
              border: "none", borderRadius: 11, padding: "11px 22px",
              fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(239,68,68,.3)", whiteSpace: "nowrap",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </Panel>
    </div>
  );
};

export default ProfilePage;
