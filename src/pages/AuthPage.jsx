// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { Panel, Field, BtnP, BtnG } from "../components/UI";

const AuthPage = ({ mode: initMode = "login", onAuth, onBack, authHook }) => {
  const [mode,   setMode]   = useState(initMode);
  const [form,   setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [err,    setErr]    = useState("");
  const [loading,setLoading]= useState(false);

  const F = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const switchMode = (m) => { setMode(m); setErr(""); setForm({ name: "", email: "", password: "", confirm: "" }); };

  const submit = async () => {
    setErr("");

    // ── Client-side validation ────────────────────────────────────────────
    if (mode === "signup") {
      if (!form.name.trim())            { setErr("Name is required"); return; }
      if (!form.email.includes("@"))    { setErr("Valid email required"); return; }
      if (form.password.length < 6)     { setErr("Password must be 6+ characters"); return; }
      if (form.password !== form.confirm){ setErr("Passwords do not match"); return; }
    } else {
      if (!form.email || !form.password){ setErr("Fill all fields"); return; }
    }

    setLoading(true);
    let result;
    if (mode === "signup") {
      result = await authHook.register(form.name, form.email, form.password);
    } else {
      result = await authHook.login(form.email, form.password);
    }
    setLoading(false);

    if (!result.success) {
      setErr(result.message || "Something went wrong");
    }
    // On success, App.jsx detects user change and redirects automatically
  };

  // Password strength
  const strength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)           s++;
    if (p.length >= 10)          s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9!@#$%]/.test(p))    s++;
    return Math.min(s, 4);
  };
  const sc = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const sl = ["", "Weak", "Fair", "Good", "Strong"];
  const ps = strength(form.password);

  return (
    <div style={{ minHeight: "100vh", background: "#05050e", display: "flex", flexDirection: "column" }}>
      {/* Back button */}
      <div style={{ padding: "20px 5%" }}>
        <BtnG onClick={onBack} style={{ padding: "8px 16px", fontSize: 13 }}>← Back to Home</BtnG>
      </div>

      {/* BG blobs */}
      <div style={{ position: "fixed", top: "30%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle,rgba(249,115,22,.1),transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "20%", right: "15%", width: 250, height: 250, background: "radial-gradient(circle,rgba(168,85,247,.08),transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 5%", position: "relative", zIndex: 2 }}>
        <div className="modal-wrap" style={{ width: "100%", maxWidth: 440 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#f97316,#dc6800)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 auto 14px" }}>₹</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9", letterSpacing: "-.02em" }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontSize: 14, color: "#4b5563", marginTop: 6 }}>
              {mode === "login" ? "Sign in to your Finwise account" : "Start tracking your finances today"}
            </p>
          </div>

          <Panel style={{ border: "1px solid rgba(255,255,255,.1)" }}>
            {/* Mode tabs */}
            <div style={{ display: "flex", background: "rgba(255,255,255,.04)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer",
                    fontSize: 14, fontWeight: 600, transition: "all .2s",
                    background: mode === m ? "#0b0b1a" : "transparent",
                    color: mode === m ? "#f97316" : "#4b5563",
                    boxShadow: mode === m ? "0 2px 12px rgba(0,0,0,.3)" : "none",
                    textTransform: "capitalize",
                    fontFamily: "'Instrument Sans',sans-serif",
                  }}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mode === "signup" && (
                <Field label="Full Name" placeholder="Arjun Sharma" value={form.name} onChange={(e) => F("name", e.target.value)} />
              )}

              <Field label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => F("email", e.target.value)} />

              <div>
                <Field
                  label="Password"
                  type="password"
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                  value={form.password}
                  onChange={(e) => F("password", e.target.value)}
                />
                {mode === "signup" && form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: ps >= i ? sc[ps] : "rgba(255,255,255,.06)", transition: "background .3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: sc[ps] }}>{sl[ps]}</span>
                  </div>
                )}
              </div>

              {mode === "signup" && (
                <Field label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={(e) => F("confirm", e.target.value)} />
              )}

              {/* Error */}
              {err && (
                <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 9, padding: "10px 14px" }}>
                  ⚠️ {err}
                </div>
              )}

              <BtnP
                onClick={submit}
                loading={loading}
                disabled={loading}
                style={{ width: "100%", textAlign: "center", padding: "13px", fontSize: 15, marginTop: 4 }}
              >
                {mode === "login" ? "Sign In →" : "Create Account →"}
              </BtnP>

              <p style={{ textAlign: "center", fontSize: 13, color: "#4b5563" }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                  style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Instrument Sans',sans-serif" }}
                >
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
