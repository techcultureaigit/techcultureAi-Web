import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const PAGE_SIZE = 5;

const emptyForm = {
  question: "",
  answer: "",
  order: 1,
  isActive: true,
};

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  async function load(query = q) {
    const res = await api.faqs({ q: query || undefined });
    setFaqs(res.data || []);
    setPage(1);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(faqs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleFaqs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return faqs.slice(start, start + PAGE_SIZE);
  }, [faqs, currentPage]);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order: (faqs[faqs.length - 1]?.order || faqs.length || 0) + 1,
    });
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id || item._id);
    setForm({
      question: item.question || "",
      answer: item.answer || "",
      order: item.order ?? 1,
      isActive: item.isActive !== false,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const maxOrder = editingId ? faqs.length : faqs.length + 1;
      let order = Number(form.order);
      if (!Number.isFinite(order)) order = maxOrder;
      order = Math.min(maxOrder, Math.max(1, Math.round(order)));

      const payload = {
        ...form,
        order,
      };
      if (editingId) await api.updateFaq(editingId, payload);
      else await api.createFaq(payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this FAQ?")) return;
    await api.deleteFaq(id);
    await load();
  }

  const actions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input !w-48 !rounded-full !py-2 text-sm"
          placeholder="Search FAQs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load(q.trim()).catch((err) => setError(err.message));
          }}
        />
        <button
          type="button"
          className="btn-ghost !rounded-full !px-4 !py-2 text-sm"
          onClick={() => load(q.trim()).catch((err) => setError(err.message))}
        >
          Search
        </button>
        <button className="btn-primary !rounded-full" type="button" onClick={openCreate}>
          New FAQ
        </button>
      </div>
    ),
    [q, faqs]
  );

  usePageTopNav({
    eyebrow: "Content",
    title: "FAQs",
    subtitle: `${faqs.length} questions · showing ${PAGE_SIZE} per page`,
    actions,
  });

  return (
    <div className="space-y-4">
      {error && !modalOpen && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-3">
        {visibleFaqs.map((item) => (
          <div key={item.id || item._id} className="card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                    #{item.order}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.isActive !== false
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.isActive !== false ? "Active" : "Hidden"}
                  </span>
                </div>
                <h3 className="font-bold text-[#2E3545]">{item.question}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-ghost !px-3 !py-1.5 text-xs"
                  type="button"
                  onClick={() => openEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                  type="button"
                  onClick={() => onDelete(item.id || item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            No FAQs yet
          </div>
        )}
      </div>

      {faqs.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-[#E8E6E1] bg-white px-4 py-3 text-sm">
          <button
            type="button"
            className="btn-ghost !px-4 !py-2 text-xs disabled:opacity-40"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-xs font-medium text-slate-500">
            Page {currentPage} of {totalPages}
            <span className="mx-1 text-slate-300">·</span>
            {visibleFaqs.length} of {faqs.length} items
          </span>
          <button
            type="button"
            className="btn-primary !rounded-full !px-4 !py-2 text-xs disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit FAQ" : "New FAQ"}
        onClose={closeModal}
        wide
      >
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Question
            </label>
            <input
              className="input"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Answer
            </label>
            <textarea
              className="input min-h-32"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Display order
              </label>
              <input
                className="input"
                type="number"
                min={1}
                max={editingId ? Math.max(1, faqs.length) : faqs.length + 1}
                value={form.order}
                onChange={(e) => {
                  const maxOrder = editingId
                    ? Math.max(1, faqs.length)
                    : faqs.length + 1;
                  let value = Number(e.target.value);
                  if (e.target.value === "") {
                    setForm({ ...form, order: "" });
                    return;
                  }
                  if (!Number.isFinite(value)) value = 1;
                  value = Math.min(maxOrder, Math.max(1, Math.round(value)));
                  setForm({ ...form, order: value });
                }}
                required
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Allowed: 1 to{" "}
                {editingId ? Math.max(1, faqs.length) : faqs.length + 1}. Other
                FAQs reorder automatically.
              </p>
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active on website
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : editingId ? "Update FAQ" : "Create FAQ"}
            </button>
            <button className="btn-ghost" type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
