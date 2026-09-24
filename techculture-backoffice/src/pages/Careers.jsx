import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const PAGE_SIZE = 4;

const emptyForm = {
  title: "",
  id: "",
  department: "Engineering",
  location: "India · Hybrid",
  type: "Full-time",
  experience: "",
  stack: "",
  summary: "",
  responsibilities: "",
  requirements: "",
  niceToHave: "",
  active: true,
};

function linesToList(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(pageNum = page, query = searchQ) {
    setLoading(true);
    setError("");
    try {
      const res = await api.jobs({
        page: pageNum,
        limit: PAGE_SIZE,
        q: query || undefined,
      });
      setJobs(res.jobs || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
      setPage(res.page || pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page, searchQ);
  }, [page, searchQ]);

  function runSearch() {
    setPage(1);
    setSearchQ(q.trim());
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title || "",
      id: job.id || "",
      department: job.department || "Engineering",
      location: job.location || "",
      type: job.type || "Full-time",
      experience: job.experience || "",
      stack: job.stack || "",
      summary: job.summary || "",
      responsibilities: (job.responsibilities || []).join("\n"),
      requirements: (job.requirements || []).join("\n"),
      niceToHave: (job.niceToHave || []).join("\n"),
      active: job.active !== false,
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
      const payload = {
        ...form,
        responsibilities: linesToList(form.responsibilities),
        requirements: linesToList(form.requirements),
        niceToHave: linesToList(form.niceToHave),
      };
      if (editingId) await api.updateJob(editingId, payload);
      else await api.createJob(payload);
      closeModal();
      if (!editingId) {
        setPage(1);
        await load(1, searchQ);
      } else {
        await load(page, searchQ);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this job opening?")) return;
    await api.deleteJob(id);
    const nextTotal = total - 1;
    const nextPages = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE));
    const nextPage = Math.min(page, nextPages);
    if (nextPage !== page) setPage(nextPage);
    else await load(nextPage, searchQ);
  }

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const actions = useMemo(
    () => (
      <>
        <div className="relative">
          <input
            className="input max-w-[220px] !rounded-full py-2.5 pr-10 sm:max-w-xs"
            placeholder="Search title / stack"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <button className="btn-ghost !rounded-full" type="button" onClick={runSearch}>
          Search
        </button>
        <button className="btn-primary !rounded-full" type="button" onClick={openCreate}>
          New opening
        </button>
      </>
    ),
    [q]
  );

  usePageTopNav({
    eyebrow: "Hiring",
    title: "Careers",
    subtitle: `${total} openings · powers /careers page`,
    actions,
  });

  return (
    <div className="space-y-6">
      {error && !modalOpen && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-3">
        {loading && jobs.length === 0 ? (
          <p className="py-10 text-center text-slate-400">Loading…</p>
        ) : jobs.length === 0 ? (
          <p className="py-10 text-center text-slate-400">No openings found</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
              <div>
                <h3 className="text-lg font-bold text-[#2E3545]">{job.title}</h3>
                <p className="text-sm text-teal-700">{job.stack}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {job.department} · {job.experience} · {job.location}
                </p>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">{job.summary}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-ghost !px-3 !py-1.5 text-xs"
                  type="button"
                  onClick={() => openEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                  type="button"
                  onClick={() => onDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-slate-500">
          {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost !rounded-full !px-4 !py-2 text-sm disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="min-w-[5.5rem] text-center text-sm font-semibold text-[#2E3545]">
            Page {page} / {pages}
          </span>
          <button
            type="button"
            className="btn-primary !rounded-full !px-4 !py-2 text-sm disabled:opacity-40"
            disabled={page >= pages || loading}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next →
          </button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        eyebrow="Hiring"
        title={editingId ? "Edit opening" : "New opening"}
        onClose={closeModal}
        wide
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-600">
              <span
                className={`relative h-6 w-11 rounded-full transition ${
                  form.active ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    form.active ? "translate-x-5" : ""
                  }`}
                />
              </span>
              Show on careers page
            </label>
            <div className="flex gap-2">
              <button className="btn-ghost !rounded-xl" type="button" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn-primary !rounded-xl"
                type="submit"
                form="career-opening-form"
                disabled={busy}
              >
                {busy ? "Saving…" : editingId ? "Update opening" : "Create opening"}
              </button>
            </div>
          </div>
        }
      >
        {error && (
          <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form id="career-opening-form" onSubmit={onSubmit} className="space-y-5">
          <section className="rounded-2xl border border-[#E8E6E1] bg-[#fafbfc] p-4 sm:p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
              Basic details
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Job title <span className="text-[#FE602F]">*</span>
                </label>
                <input
                  className="input !bg-white"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  ID / slug
                </label>
                <input
                  className="input !bg-white font-mono text-sm"
                  placeholder="senior-fullstack-developer"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Department
                </label>
                <select
                  className="input !bg-white"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {["Engineering", "Product", "Design", "Sales", "Marketing", "HR", "Operations"].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8E6E1] bg-white p-4 sm:p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FE602F]">
              Role info
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Type</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Experience
                </label>
                <input
                  className="input"
                  placeholder="e.g. 3–5 years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Location
                </label>
                <input
                  className="input"
                  placeholder="India · Hybrid"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Tech stack
                </label>
                <input
                  className="input"
                  placeholder="React, Node.js, MongoDB"
                  value={form.stack}
                  onChange={(e) => setForm({ ...form, stack: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Summary
                </label>
                <textarea
                  className="input min-h-24"
                  placeholder="Short role overview for the careers page…"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8E6E1] bg-white p-4 sm:p-5">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Job description
            </p>
            <p className="mb-4 text-xs text-slate-400">Add one point per line</p>
            <div className="space-y-4">
              {[
                ["responsibilities", "Responsibilities", "Own feature delivery…"],
                ["requirements", "Requirements", "Strong React & Node experience…"],
                ["niceToHave", "Nice to have", "Fintech domain knowledge…"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    {label}
                  </label>
                  <textarea
                    className="input min-h-28 text-sm leading-relaxed"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>
        </form>
      </Modal>
    </div>
  );
}
