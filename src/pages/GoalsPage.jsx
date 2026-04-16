// src/pages/GoalsPage.jsx
import React, { useState } from "react";
import { Panel, SectionTitle, Modal, Field, Sel, BtnP, BtnG, PageLoader, Empty } from "../components/UI";
import { fmt, monthsLeft, completionDate } from "../utils/formatters";
import { CAT_ICONS, GOAL_CATEGORIES } from "../constants/categories";

const EMPTY_FORM = { name: "", total: "", saved: "", monthly: "", category: "Savings" };

const GoalsPage = ({ goals, loading, addGoal, updateGoal, deleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const F = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr("");
  };

  const handleEdit = (g) => {
    setEditing(g);
    setForm({ name: g.name, total: g.total, saved: g.saved, monthly: g.monthly, category: g.category });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim())              { setFormErr("Goal name is required"); return; }
    if (!form.total || +form.total <= 0){ setFormErr("Enter a valid target amount"); return; }
    if (!form.monthly || +form.monthly <= 0) { setFormErr("Enter a valid monthly savings amount"); return; }
    setFormErr("");
    setSaving(true);

    const payload = {
      name:     form.name,
      total:    +form.total,
      saved:    +form.saved || 0,
      monthly:  +form.monthly,
      category: form.category,
    };

    const result = editing
      ? await updateGoal(editing._id, payload)
      : await addGoal(payload);

    setSaving(false);
    if (result.success) resetForm();
    else setFormErr(result.message || "Something went wrong");
  };

  const handleDelete = async () => {
    await deleteGoal(deleteId);
    setDeleteId(null);
  };

  // Estimated completion preview in form
  const formEta = form.total && form.monthly && +form.monthly > 0
    ? Math.ceil((+form.total - (+form.saved || 0)) / +form.monthly)
    : null;

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle sub={`${goals.length} goal${goals.length !== 1 ? "s" : ""} · ${goals.filter(g => g.saved >= g.total).length} completed`}>
          Goals
        </SectionTitle>
        <BtnP onClick={() => setShowForm(true)}>+ New Goal</BtnP>
      </div>

      {/* Goals summary bar */}
      {goals.length > 0 && (
        <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            ["Active Goals",    goals.filter(g => g.saved < g.total).length,  "#f97316"],
            ["Total Target",    fmt(goals.reduce((s,g) => s + g.total, 0)),    "#3b82f6"],
            ["Total Saved",     fmt(goals.reduce((s,g) => s + g.saved, 0)),    "#10b981"],
          ].map(([l, v, c]) => (
            <Panel key={l} style={{ textAlign: "center", padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: c }}>{v}</div>
            </Panel>
          ))}
        </div>
      )}

      {/* Goal cards */}
      {goals.length === 0 ? (
        <Panel style={{ textAlign: "center", padding: "60px 24px" }}>
          <Empty
            icon="🎯"
            message="No goals yet. Set your first financial target!"
            action="Create a Goal →"
            onAction={() => setShowForm(true)}
          />
        </Panel>
      ) : (
        goals.map((g, idx) => {
          const pct   = Math.min(100, Math.round((g.saved / g.total) * 100));
          const ml    = monthsLeft(g.total, g.saved, g.monthly);
          const eta   = ml > 0 ? completionDate(ml) : null;
          const color = pct >= 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#f97316";
          const done  = pct >= 100;

          return (
            <Panel key={g._id} className={`fu${Math.min(idx + 2, 5)} hov-card`}>
              {/* Goal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {CAT_ICONS[g.category] || "🎯"}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#f1f5f9" }}>{g.name}</span>
                      {done && <span style={{ fontSize: 11, background: "rgba(16,185,129,.15)", color: "#10b981", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>✅ Achieved!</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
                      Target: <strong style={{ color: "#f97316" }}>{fmt(g.total)}</strong>
                      {" · "}Saved: <strong style={{ color: "#10b981" }}>{fmt(g.saved)}</strong>
                      {g.saved < g.total && <span style={{ color: "#334155" }}> · Remaining: {fmt(g.total - g.saved)}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="icon-b" onClick={() => handleEdit(g)} style={{ color: "#3b82f6" }}>✏️</button>
                  <button className="icon-b" onClick={() => setDeleteId(g._id)} style={{ color: "#ef4444" }}>🗑️</button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 10, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 5, transition: "width .8s ease" }} />
              </div>

              {/* Stat grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: ml > 0 ? 14 : 0 }}>
                <div style={{ textAlign: "center", background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "14px 8px" }}>
                  <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Progress</div>
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color }}>{pct}%</div>
                </div>
                <div style={{ textAlign: "center", background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "14px 8px" }}>
                  <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Monthly</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "#3b82f6" }}>{fmt(g.monthly)}</div>
                </div>
                <div style={{ textAlign: "center", background: done ? "rgba(16,185,129,.07)" : "rgba(249,115,22,.07)", borderRadius: 12, padding: "14px 8px", border: done ? "1px solid rgba(16,185,129,.2)" : "1px solid rgba(249,115,22,.12)" }}>
                  <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Months Left</div>
                  <div style={{ fontSize: done ? 28 : 24, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", color: done ? "#10b981" : "#f97316" }}>
                    {done ? "🎉" : ml}
                  </div>
                  {!done && ml > 0 && <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>~{(ml / 12).toFixed(1)} yrs</div>}
                </div>
              </div>

              {/* ETA message */}
              {ml > 0 && (
                <div style={{ padding: "11px 16px", background: "rgba(255,255,255,.03)", borderRadius: 10, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                  💬 At <strong style={{ color: "#f1f5f9" }}>{fmt(g.monthly)}/month</strong>, you'll reach your goal in{" "}
                  <strong style={{ color: "#f97316" }}>{ml} month{ml !== 1 ? "s" : ""}</strong> — around{" "}
                  <strong style={{ color: "#f1f5f9" }}>{eta}</strong>.
                </div>
              )}
            </Panel>
          );
        })
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal title={editing ? "Edit Goal" : "New Financial Goal"} onClose={resetForm}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field
              label="Goal Name"
              placeholder="e.g. Emergency Fund, New Car, Trip to Manali"
              value={form.name}
              onChange={(e) => F("name", e.target.value)}
            />
            <Field
              label="Target Amount (₹)"
              type="number"
              placeholder="100000"
              value={form.total}
              onChange={(e) => F("total", e.target.value)}
            />
            <Field
              label="Already Saved (₹)"
              type="number"
              placeholder="0"
              value={form.saved}
              onChange={(e) => F("saved", e.target.value)}
            />
            <Field
              label="Monthly Savings (₹)"
              type="number"
              placeholder="5000"
              value={form.monthly}
              onChange={(e) => F("monthly", e.target.value)}
            />
            <Sel
              label="Category"
              value={form.category}
              onChange={(e) => F("category", e.target.value)}
            >
              {GOAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CAT_ICONS[c] || "💰"} {c}</option>
              ))}
            </Sel>

            {/* Live estimate */}
            {formEta !== null && formEta > 0 && (
              <div style={{ padding: "12px 16px", background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.2)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: "#f97316", fontWeight: 600, marginBottom: 4 }}>🎯 Estimated Timeline</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  You'll reach this goal in <strong style={{ color: "#f97316" }}>{formEta} month{formEta !== 1 ? "s" : ""}</strong>
                  {" "}— around <strong style={{ color: "#f1f5f9" }}>{completionDate(formEta)}</strong>
                </div>
              </div>
            )}
            {formEta !== null && formEta <= 0 && (
              <div style={{ padding: "12px 16px", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 12, fontSize: 13, color: "#10b981" }}>
                🎉 You've already reached this goal!
              </div>
            )}

            {formErr && (
              <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 9, padding: "10px 14px" }}>
                ⚠️ {formErr}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <BtnG style={{ flex: 1 }} onClick={resetForm}>Cancel</BtnG>
              <BtnP style={{ flex: 1 }} onClick={handleSubmit} loading={saving} disabled={saving}>
                {editing ? "Save Changes" : "Save Goal"}
              </BtnP>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Goal?" onClose={() => setDeleteId(null)} maxW={360}>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            This will permanently delete this goal and its progress data.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <BtnG style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</BtnG>
            <button
              className="hov-btn"
              onClick={handleDelete}
              style={{ flex: 1, background: "linear-gradient(135deg,#ef4444,#b91c1c)", border: "none", borderRadius: 11, padding: "12px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GoalsPage;
