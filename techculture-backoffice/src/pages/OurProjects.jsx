import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const PAGE_SIZE = 8;

const emptyForm = {
  name: "",
  projectUrl: "",
  loginId: "",
  loginPassword: "",
  gitRepoName: "",
  isActive: true,
};

export default function OurProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState(() => new Set());

  function isHttpUrl(value) {
    return /^https?:\/\//i.test(String(value || "").trim());
  }

  function togglePasswordReveal(id) {
    setRevealedPasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function load(query = q) {
    const res = await api.ourProjects({ q: query || undefined });
    setProjects(res.data || []);
    setPage(1);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, currentPage]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowPassword(false);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id || item._id);
    setForm({
      name: item.name || "",
      projectUrl: item.projectUrl || "",
      loginId: item.loginId || "",
      loginPassword: item.loginPassword || "",
      gitRepoName: item.gitRepoName || "",
      isActive: item.isActive !== false,
    });
    setShowPassword(false);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setShowPassword(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingId) await api.updateOurProject(editingId, form);
      else await api.createOurProject(form);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this project?")) return;
    await api.deleteOurProject(id);
    await load();
  }

  const actions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input !w-48 !rounded-full !py-2 text-sm"
          placeholder="Search projects…"
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
          New project
        </button>
      </div>
    ),
    [q, projects]
  );

  usePageTopNav({
    eyebrow: "Internal",
    title: "Our Project",
    subtitle: `${projects.length} project${projects.length === 1 ? "" : "s"}`,
    actions,
  });

  return (
    <div className="space-y-4">
      {error && !modalOpen && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <thead className="border-b border-[#E8E6E1] bg-[#fafbfc] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[14%] px-4 py-3 font-semibold">Project</th>
                <th className="w-[20%] px-4 py-3 font-semibold">Project URL</th>
                <th className="w-[16%] px-4 py-3 font-semibold">Login ID</th>
                <th className="w-[14%] px-4 py-3 font-semibold">Password</th>
                <th className="w-[18%] px-4 py-3 font-semibold">Git repo</th>
                <th className="w-[8%] px-4 py-3 font-semibold">Status</th>
                <th className="w-[10%] px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No projects yet
                  </td>
                </tr>
              ) : (
                visibleProjects.map((item) => {
                  const id = item.id || item._id;
                  const revealed = revealedPasswords.has(id);
                  const gitValue = item.gitRepoName || "";
                  return (
                    <tr
                      key={id}
                      className="border-b border-[#E8E6E1] last:border-0 hover:bg-teal-50/40"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#2E3545]">{item.name || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        {item.projectUrl ? (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block truncate text-teal-700 underline-offset-2 hover:underline"
                            title={item.projectUrl}
                          >
                            {item.projectUrl}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="block truncate text-slate-600" title={item.loginId || ""}>
                          {item.loginId || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.loginPassword ? (
                          <div className="flex items-center gap-2">
                            <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                              {revealed ? item.loginPassword : "••••••••"}
                            </code>
                            <button
                              type="button"
                              className="text-[11px] font-semibold text-teal-700 hover:underline"
                              onClick={() => togglePasswordReveal(id)}
                            >
                              {revealed ? "Hide" : "Show"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {gitValue ? (
                          isHttpUrl(gitValue) ? (
                            <a
                              href={gitValue}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-teal-700 underline-offset-2 hover:underline"
                              title={gitValue}
                            >
                              {gitValue.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}
                            </a>
                          ) : (
                            <span className="block truncate text-slate-600" title={gitValue}>
                              {gitValue}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.isActive !== false
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
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
                            onClick={() => onDelete(id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#E8E6E1] px-4 py-3 text-sm">
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
              {visibleProjects.length} of {projects.length} items
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
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Edit project" : "New project"}
        onClose={closeModal}
        wide
      >
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Project name
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Project URL
            </label>
            <input
              className="input"
              type="url"
              placeholder="https://…"
              value={form.projectUrl}
              onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Login ID
              </label>
              <input
                className="input"
                value={form.loginId}
                onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Login password
              </label>
              <div className="flex gap-2">
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={form.loginPassword}
                  onChange={(e) => setForm({ ...form, loginPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn-ghost !px-3 text-xs"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Git repo name
            </label>
            <input
              className="input"
              placeholder="e.g. techculture-ai-user"
              value={form.gitRepoName}
              onChange={(e) => setForm({ ...form, gitRepoName: e.target.value })}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2 pt-1">
            <button className="btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : editingId ? "Update project" : "Create project"}
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
