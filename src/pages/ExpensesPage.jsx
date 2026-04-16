// src/pages/ExpensesPage.jsx
import React, { useState } from "react";
import { Panel, SectionTitle, BtnP, BtnG, BtnDanger, Field, Sel, Modal, Empty, PageLoader } from "../components/UI";
import { fmt, todayStr } from "../utils/formatters";
import { CAT_COLORS, CAT_ICONS, EXPENSE_CATEGORIES } from "../constants/categories";

const EMPTY_FORM = { title: "", amount: "", category: "Food", date: todayStr(), notes: "" };

const ExpensesPage = ({ expenses, loading, addExpense, updateExpense, deleteExpense, dailyLimit }) => {
  const [showForm, setShowForm]   = useState(false);
  const [editing,  setEditing]    = useState(null);
  const [filter,   setFilter]     = useState("All");
  const [sort,     setSort]       = useState("date");
  const [deleteId, setDeleteId]   = useState(null);
  const [search,   setSearch]     = useState("");
  const [form,     setForm]       = useState(EMPTY_FORM);
  const [saving,   setSaving]     = useState(false);
  const [formErr,  setFormErr]    = useState("");

  const F = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr("");
  };

  const handleEdit = (exp) => {
    setEditing(exp);
    setForm({ title: exp.title, amount: exp.amount, category: exp.category, date: exp.date, notes: exp.notes || "" });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { setFormErr("Title is required"); return; }
    if (!form.amount || +form.amount <= 0) { setFormErr("Enter a valid amount"); return; }
    if (!form.date) { setFormErr("Date is required"); return; }
    setFormErr("");
    setSaving(true);

    const payload = { ...form, amount: +form.amount };
    const result = editing
      ? await updateExpense(editing._id, payload)
      : await addExpense(payload);

    setSaving(false);
    if (result.success) resetForm();
    else setFormErr(result.message || "Something went wrong");
  };

  const handleDelete = async () => {
    await deleteExpense(deleteId);
    setDeleteId(null);
  };

  // Today limit bar
  const td = todayStr();
  const todaySpent = expenses.filter((e) => e.date === td).reduce((s, e) => s + e.amount, 0);

  // Filter + sort
  let list = [...expenses];
  if (filter !== "All") list = list.filter((e) => e.category === filter);
  if (search)           list = list.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  list.sort(sort === "amount"
    ? (a, b) => b.amount - a.amount
    : (a, b) => b.date.localeCompare(a.date)
  );

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle sub={`${expenses.length} total transactions`}>Expenses</SectionTitle>
        <BtnP onClick={() => setShowForm(true)}>+ Add Expense</BtnP>
      </div>

      {/* Daily limit bar */}
      {dailyLimit > 0 && (
        <div className="fu2" style={{ background: todaySpent > dailyLimit ? "rgba(239,68,68,.07)" : "rgba(249,115,22,.06)", border: `1px solid ${todaySpent > dailyLimit ? "rgba(239,68,68,.2)" : "rgba(249,115,22,.15)"}`, borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>TODAY'S SPENDING vs DAILY LIMIT</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: todaySpent > dailyLimit ? "#ef4444" : "#f97316" }}>
                {fmt(todaySpent)}<span style={{ fontSize: 13, color: "#4b5563", fontWeight: 400 }}> / {fmt(dailyLimit)}</span>
              </div>
            </div>
            <div style={{ fontSize: 28 }}>{todaySpent > dailyLimit ? "🚨" : "✅"}</div>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.06)", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (todaySpent / dailyLimit) * 100)}%`, background: todaySpent > dailyLimit ? "linear-gradient(90deg,#ef4444,#b91c1c)" : "linear-gradient(90deg,#f97316,#dc6800)", borderRadius: 3, transition: "width .5s" }} />
          </div>
        </div>
      )}

      <Panel className="fu3">
        {/* Search + sort */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search expenses..."
            style={{ flex: 1, minWidth: 150, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#f1f5f9", fontFamily: "'Instrument Sans',sans-serif" }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ background: "#0b0b1a", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "9px 14px", fontSize: 12, color: "#64748b", fontFamily: "'Instrument Sans',sans-serif" }}>
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
          </select>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
          {["All", ...EXPENSE_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? "rgba(249,115,22,.15)" : "transparent", border: `1px solid ${filter === c ? "#f97316" : "rgba(255,255,255,.08)"}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: filter === c ? "#f97316" : "#64748b", cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif" }}>
              {c}
            </button>
          ))}
        </div>

        {/* List */}
        {list.length === 0 ? (
          <Empty icon="💸" message={search ? "No matching expenses found" : "No expenses yet"} action={!search ? "Add your first expense →" : null} onAction={() => setShowForm(true)} />
        ) : (
          list.map((exp, i) => (
            <div key={exp._id} className="hov-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderTop: i > 0 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${CAT_COLORS[exp.category]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{CAT_ICONS[exp.category] || "📦"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.title}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                  <span style={{ color: CAT_COLORS[exp.category] }}>●</span> {exp.category} · {exp.date}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginRight: 6 }}>{fmt(exp.amount)}</div>
              <button className="icon-b" onClick={() => handleEdit(exp)} style={{ color: "#3b82f6" }}>✏️</button>
              <button className="icon-b" onClick={() => setDeleteId(exp._id)} style={{ color: "#ef4444" }}>🗑️</button>
            </div>
          ))
        )}
      </Panel>

      {/* Add / Edit modal */}
      {showForm && (
        <Modal title={editing ? "Edit Expense" : "Add Expense"} onClose={resetForm}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Title" placeholder="e.g. Grocery Store" value={form.title} onChange={(e) => F("title", e.target.value)} />
            <Field label="Amount (₹)" type="number" placeholder="0" value={form.amount} onChange={(e) => F("amount", e.target.value)} />
            <Field label="Date" type="date" value={form.date} onChange={(e) => F("date", e.target.value)} />
            <Sel label="Category" value={form.category} onChange={(e) => F("category", e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </Sel>
            <Field label="Notes (optional)" placeholder="Any details…" value={form.notes} onChange={(e) => F("notes", e.target.value)} />
            {formErr && <div style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.08)", borderRadius: 9, padding: "10px 14px" }}>⚠️ {formErr}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <BtnG style={{ flex: 1 }} onClick={resetForm}>Cancel</BtnG>
              <BtnP style={{ flex: 1 }} onClick={handleSubmit} loading={saving} disabled={saving}>
                {editing ? "Save Changes" : "Add Expense"}
              </BtnP>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Expense?" onClose={() => setDeleteId(null)} maxW={360}>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <BtnG style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</BtnG>
            <BtnDanger style={{ flex: 1 }} onClick={handleDelete}>Delete</BtnDanger>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesPage;
