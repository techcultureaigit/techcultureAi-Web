import { invoiceApi } from "@/lib/api";
import type { InvoiceDocument } from "@/lib/invoiceTypes";

export type InvoiceMailKind = "payment_request" | "reminder" | "paid";

export async function sendInvoiceMail(
  invoice: InvoiceDocument,
  kind: InvoiceMailKind = "payment_request",
) {
  const to = (invoice.billTo?.email || invoice.email || "").trim().toLowerCase();
  if (!to) {
    throw new Error("Customer email is required to send invoice mail");
  }

  const data = await invoiceApi.sendInvoiceMail({
    invoiceId: invoice.id,
    invoice,
    to,
    kind,
  });

  return {
    success: true as const,
    message: data.message || `Invoice emailed to ${to}`,
    messageId: data.messageId,
    sentAt: data.sentAt || new Date().toISOString(),
    kind: data.kind || kind,
    patch: data.patch || {},
  };
}
