import { invoiceCollection, toAppDoc } from "../db.js";
import { shapeInvoice } from "../schemas.js";
import { buildInvoiceCoverEmail } from "../invoiceEmailHtml.js";
import { createTransport, getInvoiceMailAttachments } from "../mailer.js";
import { invoicePdfFilename, renderInvoicePdfBuffer } from "../invoicePdf.js";
import { loadMailSettingsFromDb } from "./settingsController.js";

function invoicesCol() {
  return invoiceCollection("invoices");
}

async function findInvoice(id) {
  return invoicesCol().findOne({
    $or: [{ id }, { _id: id }, { invoiceNo: id }],
  });
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function invoiceAmount(doc) {
  if (doc.amount != null && doc.amount !== "") return num(doc.amount);
  const items = Array.isArray(doc.lineItems) ? doc.lineItems : [];
  const sub = items.reduce((s, i) => s + num(i.qty) * num(i.rate), 0);
  if (!doc.gstApplicable) return sub;
  return sub + (sub * num(doc.gstPercent)) / 100;
}

async function customerOutstanding(invoice, { includeCurrentIfMissing = true } = {}) {
  const email = String(invoice.billTo?.email || invoice.email || "")
    .trim()
    .toLowerCase();
  const name = String(invoice.billTo?.name || invoice.name || "").trim();
  const or = [];
  if (email) {
    or.push({ "billTo.email": email }, { email });
  }
  if (name) {
    or.push({ "billTo.name": name }, { name });
  }
  if (!or.length) {
    return includeCurrentIfMissing ? invoiceAmount(invoice) : 0;
  }

  const docs = await invoicesCol()
    .find({
      $and: [
        { $or: or },
        {
          status: { $in: ["Pending", "Overdue", "pending", "overdue"] },
        },
      ],
    })
    .toArray();

  let total = docs.reduce((sum, doc) => sum + invoiceAmount(doc), 0);
  if (includeCurrentIfMissing && total <= 0) {
    total = invoiceAmount(invoice);
  }
  return total;
}

export async function sendInvoiceMail(req, res) {
  try {
    const kind = String(req.body?.kind || "payment_request").trim() || "payment_request";
    const invoiceId = String(req.body?.invoiceId || req.body?.id || "").trim();
    let invoice = null;

    if (invoiceId) {
      const doc = await findInvoice(invoiceId);
      if (!doc) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }
      invoice = shapeInvoice(toAppDoc(doc), { keepId: String(doc.id || doc._id) });
    } else if (req.body?.invoice) {
      invoice = shapeInvoice(req.body.invoice, {
        keepId: String(req.body.invoice.id || req.body.invoice.invoiceNo || ""),
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "invoiceId or invoice payload is required",
      });
    }

    const to = String(
      req.body?.to || invoice.billTo?.email || invoice.email || "",
    )
      .trim()
      .toLowerCase();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({
        success: false,
        message: "A valid customer email is required",
      });
    }

    const status = String(
      kind === "paid" ? "Paid" : invoice.status || "Pending",
    ).toLowerCase();

    if (kind === "paid" && status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Paid confirmation can only be sent for Paid invoices",
      });
    }
    if (kind !== "paid" && status !== "pending" && status !== "overdue") {
      return res.status(400).json({
        success: false,
        message: "Payment emails can only be sent for Pending or Overdue invoices",
      });
    }

    const mailSettings = await loadMailSettingsFromDb();
    const dueDays = Number(mailSettings.overdueAfterDays || 15);
    // Pending/Overdue list = total outstanding. After mark-paid, this invoice is Paid so remaining = balance due.
    const outstanding = await customerOutstanding(invoice, {
      includeCurrentIfMissing: kind !== "paid",
    });

    const email = buildInvoiceCoverEmail(invoice, {
      kind,
      extras: {
        dueDays,
        dueDate: invoice.dueDate || undefined,
        outstanding,
        balanceDue: outstanding,
        paymentDate: new Date().toISOString().slice(0, 10),
        settings: mailSettings,
      },
    });

    const pdfBuffer = await renderInvoicePdfBuffer(invoice, { settings: mailSettings });
    const attachments = getInvoiceMailAttachments({
      filename: invoicePdfFilename(invoice),
      content: pdfBuffer,
    });

    const { transporter, config } = createTransport(mailSettings);
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments,
    });

    const sentAt = new Date().toISOString();
    const patch = {};

    if (kind === "paid") {
      patch.paidEmailSentAt = sentAt;
    } else {
      if (!invoice.firstSentAt) patch.firstSentAt = sentAt;
      patch.lastReminderAt = sentAt;
    }

    if (invoice.id && Object.keys(patch).length) {
      await invoicesCol().updateOne(
        { $or: [{ id: invoice.id }, { _id: invoice.id }] },
        { $set: { ...patch, updatedAt: sentAt } },
      );
    }

    const label =
      kind === "paid"
        ? "Paid confirmation emailed"
        : kind === "reminder"
          ? "Reminder emailed"
          : "Invoice emailed";

    return res.json({
      success: true,
      message: `${label} to ${to} (PDF attached)`,
      messageId: info.messageId,
      sentAt,
      kind,
      to,
      invoiceId: invoice.id,
      patch,
    });
  } catch (err) {
    console.error("[invoice] sendInvoiceMail", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send invoice email",
    });
  }
}
