import { invoiceCollection } from "../db.js";

export async function getDashboard(_req, res) {
  try {
    const [invoices, customers, payments] = await Promise.all([
      invoiceCollection("invoices").find({}).toArray(),
      invoiceCollection("customers").find({}).toArray(),
      invoiceCollection("payments").find({}).toArray(),
    ]);

    const totalRevenue = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

    const outstanding = invoices
      .filter((inv) => inv.status !== "Paid")
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

    const paymentsTotal = payments.reduce((sum, pay) => sum + Number(pay.amount || 0), 0);

    return res.json({
      success: true,
      summary: {
        totalInvoices: invoices.length,
        paidInvoices: invoices.filter((inv) => inv.status === "Paid").length,
        pendingInvoices: invoices.filter((inv) => inv.status === "Pending").length,
        overdueInvoices: invoices.filter((inv) => inv.status === "Overdue").length,
        customerCount: customers.length,
        paymentCount: payments.length,
        totalRevenue,
        outstanding,
        paymentsTotal,
      },
      recentInvoices: invoices
        .slice()
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
        .slice(0, 5),
    });
  } catch (err) {
    console.error("[invoice] getDashboard", err);
    return res.status(500).json({ success: false, message: "Failed to load dashboard" });
  }
}

export async function getWorkspaceBundle(_req, res) {
  try {
    const [invoices, customers, payments] = await Promise.all([
      invoiceCollection("invoices").find({}).sort({ date: -1 }).toArray(),
      invoiceCollection("customers").find({}).sort({ updatedAt: -1 }).toArray(),
      invoiceCollection("payments").find({}).sort({ date: -1 }).toArray(),
    ]);

    return res.json({
      success: true,
      data: {
        Invoices: invoices,
        Customers: customers,
        Payments: payments,
      },
    });
  } catch (err) {
    console.error("[invoice] getWorkspaceBundle", err);
    return res.status(500).json({ success: false, message: "Failed to load workspace data" });
  }
}
