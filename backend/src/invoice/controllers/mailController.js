import { invoiceCollection, toAppDoc } from "../db.js";
import { shapeInvoice } from "../schemas.js";
import { buildInvoiceDocumentHtml } from "../invoiceEmailHtml.js";
import { createTransport, getInvoiceMailAttachments } from "../mailer.js";
import { loadMailSettingsFromDb } from "./settingsController.js";

function invoicesCol() {
  return invoiceCollection("invoices");
}

async function findInvoice(id) {
  return invoicesCol().findOne({
    $or: [{ id }, { _id: id }, { invoiceNo: id }],
  });
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

    const email = buildInvoiceDocumentHtml(
      { ...invoice, status: kind === "paid" ? "Paid" : invoice.status },
      { kind },
    );
    const mailSettings = await loadMailSettingsFromDb();
    const { transporter, config } = createTransport(mailSettings);
    const attachments = getInvoiceMailAttachments();

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
      message: `${label} to ${to}`,
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
