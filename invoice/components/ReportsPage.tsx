"use client";

import { useMemo, useState } from "react";
import { AppIcon, Icons } from "@/components/icons";
import { formatInvoiceDate } from "@/lib/invoiceUtils";
import { toast } from "@/lib/notify";
import "./ReportsPage.css";

export type ReportInvoice = {
  id: string;
  invoiceNo?: string;
  name?: string;
  email?: string;
  amount?: number;
  status?: string;
  date?: string;
};

export type ReportCustomer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type Props = {
  invoices: ReportInvoice[];
  customers: ReportCustomer[];
  onOpenInvoice?: (invoice: ReportInvoice) => void;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

function statusOf(invoice: ReportInvoice) {
  return String(invoice.status || "Pending").toLowerCase();
}

function matchesCustomer(invoice: ReportInvoice, customer: ReportCustomer) {
  const invName = String(invoice.name || "").trim().toLowerCase();
  const invEmail = String(invoice.email || "").trim().toLowerCase();
  const custName = customer.name.trim().toLowerCase();
  const custEmail = String(customer.email || "").trim().toLowerCase();
  if (custEmail && invEmail && custEmail === invEmail) return true;
  if (custName && invName && custName === invName) return true;
  return false;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function summarize(list: ReportInvoice[]) {
  const paid = list.filter((i) => statusOf(i) === "paid");
  const pending = list.filter((i) => statusOf(i) === "pending");
  const overdue = list.filter((i) => statusOf(i) === "overdue");
  const unpaid = list.filter((i) => statusOf(i) !== "paid");
  return {
    count: list.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    overdueCount: overdue.length,
    paidAmount: paid.reduce((a, i) => a + Number(i.amount || 0), 0),
    pendingAmount: pending.reduce((a, i) => a + Number(i.amount || 0), 0),
    overdueAmount: overdue.reduce((a, i) => a + Number(i.amount || 0), 0),
    outstanding: unpaid.reduce((a, i) => a + Number(i.amount || 0), 0),
    total: list.reduce((a, i) => a + Number(i.amount || 0), 0),
  };
}

export default function ReportsPage({ invoices, customers, onOpenInvoice }: Props) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const selectedCustomer =
    selectedCustomerId === "all"
      ? null
      : customers.find((c) => c.id === selectedCustomerId) || null;

  const scopedInvoices = useMemo(() => {
    let list = invoices.slice();
    if (selectedCustomer) {
      list = list.filter((inv) => matchesCustomer(inv, selectedCustomer));
    }
    if (statusFilter !== "all") {
      list = list.filter((inv) => statusOf(inv) === statusFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((inv) =>
        [inv.invoiceNo, inv.id, inv.name, inv.email, inv.status, inv.date]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return list.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  }, [invoices, selectedCustomer, statusFilter, query]);

  const overall = useMemo(() => summarize(invoices), [invoices]);
  const scoped = useMemo(() => summarize(scopedInvoices), [scopedInvoices]);

  const customerRows = useMemo(() => {
    const byKey = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        invoices: ReportInvoice[];
      }
    >();

    for (const customer of customers) {
      byKey.set(customer.id, {
        id: customer.id,
        name: customer.name,
        email: customer.email || "",
        invoices: [],
      });
    }

    for (const invoice of invoices) {
      const matched = customers.find((c) => matchesCustomer(invoice, c));
      if (matched) {
        byKey.get(matched.id)?.invoices.push(invoice);
      } else {
        const key = `orphan:${(invoice.email || invoice.name || invoice.id).toLowerCase()}`;
        if (!byKey.has(key)) {
          byKey.set(key, {
            id: key,
            name: invoice.name || "Unknown customer",
            email: invoice.email || "",
            invoices: [],
          });
        }
        byKey.get(key)!.invoices.push(invoice);
      }
    }

    return Array.from(byKey.values())
      .map((row) => ({ ...row, stats: summarize(row.invoices) }))
      .filter((row) => row.stats.count > 0 || customers.some((c) => c.id === row.id))
      .sort((a, b) => b.stats.total - a.stats.total);
  }, [customers, invoices]);

  function exportAllCustomers() {
    const rows: string[][] = [
      [
        "Customer",
        "Email",
        "Invoices",
        "Paid count",
        "Pending count",
        "Overdue count",
        "Paid amount",
        "Outstanding",
        "Total billed",
      ],
      ...customerRows.map((row) => [
        row.name,
        row.email,
        String(row.stats.count),
        String(row.stats.paidCount),
        String(row.stats.pendingCount),
        String(row.stats.overdueCount),
        String(row.stats.paidAmount),
        String(row.stats.outstanding),
        String(row.stats.total),
      ]),
    ];
    downloadCsv(`all-customers-report-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.success("All customers report downloaded.", "Export ready");
  }

  function exportSelectedReport() {
    const label = selectedCustomer?.name || "all-invoices";
    const rows: string[][] = [
      ["Invoice No", "Customer", "Email", "Date", "Status", "Amount"],
      ...scopedInvoices.map((inv) => [
        inv.invoiceNo || inv.id,
        inv.name || "",
        inv.email || "",
        inv.date ? formatInvoiceDate(inv.date) : "",
        inv.status || "",
        String(inv.amount || 0),
      ]),
    ];
    const safe = label.replace(/[^\w\-]+/g, "-").toLowerCase();
    downloadCsv(`${safe}-report-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.success(
      selectedCustomer
        ? `Report exported for ${selectedCustomer.name}.`
        : "Full invoice report exported.",
      "Export ready",
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-stats">
        <div className="reports-stat">
          <span>Total billed</span>
          <strong>{money(overall.total)}</strong>
          <small>{overall.count} invoices across all customers</small>
        </div>
        <div className="reports-stat">
          <span>Collected (Paid)</span>
          <strong>{money(overall.paidAmount)}</strong>
          <small>{overall.paidCount} paid invoices</small>
        </div>
        <div className="reports-stat">
          <span>Outstanding</span>
          <strong>{money(overall.outstanding)}</strong>
          <small>
            {overall.pendingCount} pending · {overall.overdueCount} overdue
          </small>
        </div>
        <div className="reports-stat">
          <span>Customers</span>
          <strong>{String(customers.length).padStart(2, "0")}</strong>
          <small>{customerRows.filter((r) => r.stats.count > 0).length} with invoices</small>
        </div>
      </div>

      <section className="reports-panel">
        <div className="reports-panel-head">
          <div>
            <h2>Customer & invoice reports</h2>
            <p>
              View full report for one customer, or browse every customer&apos;s billing summary.
            </p>
          </div>
        </div>

        <div style={{ padding: "14px 20px" }}>
          <div className="reports-toolbar">
            <div className="reports-filters">
              <label>
                Customer
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="all">All customers</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.email ? ` (${c.email})` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label>
                Search invoices
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Invoice no, name, email..."
                />
              </label>
            </div>
            <div className="reports-actions">
              <button type="button" className="btn btn-secondary" onClick={exportSelectedReport}>
                <AppIcon icon={Icons.download} size={14} />
                {selectedCustomer ? "Export customer CSV" : "Export invoices CSV"}
              </button>
              <button type="button" className="btn btn-primary" onClick={exportAllCustomers}>
                <AppIcon icon={Icons.download} size={14} /> Export all customers
              </button>
            </div>
          </div>
        </div>

        <div className="reports-summary-strip">
          <div>
            <span>{selectedCustomer ? "Customer billed" : "Filtered billed"}</span>
            <strong>{money(scoped.total)}</strong>
          </div>
          <div>
            <span>Collected</span>
            <strong>{money(scoped.paidAmount)}</strong>
          </div>
          <div>
            <span>Outstanding</span>
            <strong>{money(scoped.outstanding)}</strong>
          </div>
          <div>
            <span>Invoices shown</span>
            <strong>{scoped.count}</strong>
          </div>
        </div>

        <div className="reports-table-wrap">
          {scopedInvoices.length === 0 ? (
            <div className="reports-empty">
              No invoices found for this filter.
              {selectedCustomer ? ` Try another customer or clear status filter.` : ""}
            </div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>INVOICE</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {scopedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={onOpenInvoice ? "clickable" : undefined}
                    onClick={() => onOpenInvoice?.(inv)}
                  >
                    <td className="name-cell">
                      <b>{inv.invoiceNo || inv.id}</b>
                      <small>{inv.id}</small>
                    </td>
                    <td className="name-cell">
                      <b>{inv.name || "—"}</b>
                      <small>{inv.email || "No email"}</small>
                    </td>
                    <td>{inv.date ? formatInvoiceDate(inv.date) : "—"}</td>
                    <td>
                      <span
                        className={`status status-${(inv.status || "pending")
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {inv.status || "Pending"}
                      </span>
                    </td>
                    <td className="amount">{money(Number(inv.amount || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="reports-panel">
        <div className="reports-panel-head">
          <div>
            <h2>All customers report</h2>
            <p>Complete billing summary for every customer — paid, pending, overdue and totals.</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={exportAllCustomers}>
            <AppIcon icon={Icons.download} size={14} /> Download CSV
          </button>
        </div>
        <div className="reports-table-wrap">
          {customerRows.length === 0 ? (
            <div className="reports-empty">No customer billing data yet.</div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>INVOICES</th>
                  <th>PAID</th>
                  <th>PENDING</th>
                  <th>OVERDUE</th>
                  <th>OUTSTANDING</th>
                  <th>TOTAL BILLED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customerRows.map((row) => (
                  <tr key={row.id}>
                    <td className="name-cell">
                      <b>{row.name}</b>
                      <small>{row.email || "No email"}</small>
                    </td>
                    <td>{row.stats.count}</td>
                    <td className="amount">{money(row.stats.paidAmount)}</td>
                    <td className="amount">{money(row.stats.pendingAmount)}</td>
                    <td className="amount">{money(row.stats.overdueAmount)}</td>
                    <td className="amount">{money(row.stats.outstanding)}</td>
                    <td className="amount">{money(row.stats.total)}</td>
                    <td>
                      {!String(row.id).startsWith("orphan:") ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: "7px 10px", fontSize: 10 }}
                          onClick={() => {
                            setSelectedCustomerId(row.id);
                            setStatusFilter("all");
                            setQuery("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          View report
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
