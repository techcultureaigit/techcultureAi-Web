import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No-show" },
];

function statusTone(status) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    case "cancelled":
      return "bg-red-50 text-red-600";
    case "no-show":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-teal-50 text-teal-700";
  }
}

function formatWhen(date, time) {
  if (!date) return "—";
  try {
    const label = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return time ? `${label} · ${time}` : label;
  } catch {
    return time ? `${date} · ${time}` : date;
  }
}

export default function DemoBookings() {
  const [bookings, setBookings] = useState([]);
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
        const res = await api.demos({
          page: pageNum,
          limit: PAGE_SIZE,
          q: query || undefined,
          status: statusFilter || undefined,
        });
        setBookings(res.bookings || []);
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
    load(page, searchQ, status);
  }, [page, searchQ, status]);

  function runSearch() {
    setPage(1);
    setSearchQ(q.trim());
  }

  async function updateStatus(id, nextStatus) {
    setBusy(true);
    setError("");
    try {
      const res = await api.updateDemo(id, { status: nextStatus });
      setSelected(res.data || null);
      await load(page, searchQ, status);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this demo booking?")) return;
    setBusy(true);
    try {
      await api.deleteDemo(id);
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
        <div className="relative">
          <input
            className="input !w-52 !rounded-full !py-2 pr-10 text-sm"
            placeholder="Search name / email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-semibold text-teal-700"
            onClick={runSearch}
          >
            Search
          </button>
        </div>
        <select
          className="input !w-auto !rounded-full !py-2 text-sm"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    ),
    [q, status]
  );

  usePageTopNav({
    eyebrow: "Leads",
    title: "Demo bookings",
    subtitle: `${total} booking${total === 1 ? "" : "s"} · from Schedule Demo`,
    actions,
  });

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E8E6E1] bg-[#fafbfc] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Guest</th>
                <th className="px-4 py-3 font-semibold">Slot</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    No demo bookings yet
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#E8E6E1] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#2E3545]">{b.fullName}</p>
                      <p className="text-xs text-slate-500">{b.workEmail}</p>
                      {b.phone ? (
                        <p className="text-xs text-slate-400">{b.phone}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatWhen(b.demoDate, b.demoTime)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{b.company || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusTone(
                          b.status
                        )}`}
                      >
                        {b.status || "scheduled"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="btn-ghost !px-3 !py-1.5 text-xs"
                        onClick={() => setSelected(b)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E6E1] px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + (bookings.length ? 1 : 0)}–
            {(page - 1) * PAGE_SIZE + bookings.length} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost !rounded-full !px-3 !py-1.5 text-xs"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-600">
              Page {page} / {pages}
            </span>
            <button
              type="button"
              className="btn-ghost !rounded-full !px-3 !py-1.5 text-xs"
              disabled={page >= pages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        title={selected?.fullName || "Demo booking"}
        eyebrow="Booking details"
        onClose={() => setSelected(null)}
        wide
        footer={
          selected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <select
                className="input !w-auto !rounded-xl text-sm"
                value={selected.status || "scheduled"}
                disabled={busy}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
              >
                {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                  disabled={busy}
                  onClick={() => onDelete(selected.id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn-ghost !rounded-full"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                Scheduled slot
              </p>
              <p className="mt-1 text-lg font-bold text-[#2E3545]">
                {formatWhen(selected.demoDate, selected.demoTime)} IST
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Full name", selected.fullName],
                ["Work email", selected.workEmail],
                ["Phone", selected.phone || "—"],
                ["Company", selected.company || "—"],
                ["Location", selected.location || "—"],
                ["Status", selected.status || "scheduled"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#E8E6E1] bg-[#fafbfc] px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 break-all text-sm font-semibold text-[#2E3545]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {selected.message ? (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">Message</p>
                <p className="rounded-xl border border-[#E8E6E1] bg-white px-3 py-2 text-sm text-slate-700">
                  {selected.message}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {selected.meetLink ? (
                <a
                  href={selected.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary !rounded-full !px-4 !py-2 text-xs"
                >
                  Open Meet
                </a>
              ) : null}
              {selected.calendarLink ? (
                <a
                  href={selected.calendarLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !rounded-full !px-4 !py-2 text-xs"
                >
                  Open Calendar
                </a>
              ) : null}
              {selected.workEmail ? (
                <a
                  href={`mailto:${selected.workEmail}`}
                  className="btn-ghost !rounded-full !px-4 !py-2 text-xs"
                >
                  Email guest
                </a>
              ) : null}
            </div>

            <p className="text-xs text-slate-400">
              Booked{" "}
              {selected.createdAt
                ? new Date(selected.createdAt).toLocaleString("en-IN")
                : "—"}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
