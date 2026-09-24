import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

function statusTone(status) {
  switch (status) {
    case "replied":
      return "bg-emerald-50 text-emerald-700";
    case "archived":
      return "bg-slate-100 text-slate-600";
    case "read":
      return "bg-teal-50 text-teal-700";
    default:
      return "bg-orange-50 text-[#d9471b]";
  }
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (pageNum = page, query = searchQ, statusFilter = status) => {
      setLoading(true);
      setError("");
      try {
        const res = await api.contacts({
          page: pageNum,
          limit: PAGE_SIZE,
          q: query || undefined,
          status: statusFilter || undefined,
        });
        setMessages(res.messages || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
        setPage(res.page || pageNum);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [page, searchQ, status]
  );

  useEffect(() => {
    load(1, searchQ, status).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQ, status]);

  async function markStatus(id, nextStatus) {
    setBusy(true);
    try {
      await api.updateContact(id, { status: nextStatus });
      setSelected((prev) =>
        prev && (prev.id === id || prev._id === id)
          ? { ...prev, status: nextStatus }
          : prev
      );
      await load(page, searchQ, status);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this message?")) return;
    setBusy(true);
    try {
      await api.deleteContact(id);
      setSelected(null);
      await load(page, searchQ, status);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const actions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input !w-48 !rounded-full !py-2 text-sm"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchQ(q.trim());
              setPage(1);
            }
          }}
        />
        <select
          className="input !w-auto !rounded-full !py-2 text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-ghost !rounded-full !px-4 !py-2 text-sm"
          onClick={() => {
            setSearchQ(q.trim());
            setPage(1);
          }}
        >
          Search
        </button>
      </div>
    ),
    [q, status]
  );

  usePageTopNav({
    eyebrow: "Inbox",
    title: "Contact messages",
    subtitle: `${total} messages · from website form`,
    actions,
  });

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E8E6E1] bg-[#fafbfc] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">From</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                    No messages yet
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr
                    key={m.id || m._id}
                    className="cursor-pointer border-b border-[#E8E6E1] last:border-0 hover:bg-teal-50/40"
                    onClick={() => {
                      setSelected(m);
                      if (m.status === "new") {
                        markStatus(m.id || m._id, "read").catch(() => {});
                      }
                    }}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#2E3545]">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.subject || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusTone(
                          m.status
                        )}`}
                      >
                        {m.status || "new"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(m.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E8E6E1] px-4 py-3 text-sm">
            <button
              type="button"
              className="btn-ghost !px-3 !py-1.5 text-xs"
              disabled={page <= 1 || loading}
              onClick={() => load(page - 1)}
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              className="btn-ghost !px-3 !py-1.5 text-xs"
              disabled={page >= pages || loading}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        title={selected?.subject || "Message"}
        onClose={() => setSelected(null)}
        wide
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-500">Name</p>
                <p className="font-semibold text-[#2E3545]">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="font-semibold text-teal-700 hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Phone</p>
                <p className="text-[#2E3545]">{selected.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Received</p>
                <p className="text-[#2E3545]">{formatDate(selected.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">Message</p>
              <p className="whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-[#2E3545]">
                {selected.message}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                className="btn-primary !rounded-full"
                disabled={busy}
                onClick={() => markStatus(selected.id || selected._id, "replied")}
              >
                Mark replied
              </button>
              <button
                type="button"
                className="btn-ghost !rounded-full"
                disabled={busy}
                onClick={() => markStatus(selected.id || selected._id, "archived")}
              >
                Archive
              </button>
              <button
                type="button"
                className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                disabled={busy}
                onClick={() => onDelete(selected.id || selected._id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
