import nodemailer from "nodemailer";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to invoice/.env.local`);
  }
  return value;
}

export function getMailConfig() {
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS").replace(/\s+/g, "");
  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    user,
    pass,
    fromName: process.env.SMTP_FROM_NAME?.trim() || "TechCulture Studio",
  };
}

export function createTransport() {
  const config = getMailConfig();
  return {
    config,
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    }),
  };
}

export type InvoiceMailKind = "payment_request" | "reminder" | "paid";

export type InvoiceMailPayload = {
  to: string;
  customerName: string;
  invoiceId: string;
  amount: number;
  status: string;
  date: string;
  description?: string;
  lineItems?: Array<{ description: string; qty: number; rate: number }>;
  kind?: InvoiceMailKind;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function lineItemText(
  lineItems: Array<{ description: string; qty: number; rate: number }> = [],
) {
  return lineItems
    .filter((item) => item.description)
    .map(
      (item, index) =>
        `${index + 1}. ${item.description} | Qty ${item.qty} | Rate ${item.rate} | Amount ${
          Number(item.qty || 0) * Number(item.rate || 0)
        }`,
    );
}

function lineItemRows(
  lineItems: Array<{ description: string; qty: number; rate: number }> = [],
) {
  return lineItems
    .filter((item) => item.description)
    .map((item) => {
      const lineAmount = Number(item.qty || 0) * Number(item.rate || 0);
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #e5eaf0">${item.description}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eaf0;text-align:center">${item.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eaf0;text-align:right">${Number(item.rate || 0).toFixed(2)}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eaf0;text-align:right">${lineAmount.toFixed(2)}</td>
      </tr>`;
    })
    .join("");
}

export function buildInvoiceEmail(payload: InvoiceMailPayload) {
  const kind = payload.kind || "payment_request";
  const amount = formatAmount(payload.amount);
  const lines = lineItemText(payload.lineItems);
  const lineRows = lineItemRows(payload.lineItems);

  const paymentInstructions = [
    "How to complete payment:",
    "1. Make the payment for this invoice.",
    "2. Reply to this email with your payment proof attached (screenshot / receipt).",
    "3. We will verify the payment and mark your invoice as Paid.",
  ].join("\n");

  const paymentInstructionsHtml = `
    <div style="margin:0 0 18px;padding:14px 16px;border:1px solid #ffe0cb;border-radius:10px;background:#fff8f2">
      <p style="margin:0 0 8px;font-weight:700;color:#c65b0a">How to complete payment</p>
      <ol style="margin:0;padding-left:18px;color:#445264">
        <li>Make the payment for this invoice.</li>
        <li>Reply to this email with your payment proof attached (screenshot / receipt).</li>
        <li>We will verify the payment and mark your invoice as Paid.</li>
      </ol>
    </div>
  `;

  let subject = `Invoice ${payload.invoiceId} from TechCulture Technologies`;
  let intro =
    "Please find your invoice from TECHCULTURE TECHNOLOGIES PRIVATE LIMITED. Payment is pending.";
  let closing = "Thank you,";

  if (kind === "reminder") {
    subject = `Payment reminder — Invoice ${payload.invoiceId}`;
    intro =
      "This is a friendly reminder that your invoice is still awaiting payment. Please complete payment at your earliest convenience.";
  } else if (kind === "paid") {
    subject = `Payment confirmed — Invoice ${payload.invoiceId}`;
    intro =
      "Great news! We have received and verified your payment. Your invoice is now marked as Paid.";
    closing = "Thank you for your payment,";
  }

  const text = [
    `Hi ${payload.customerName},`,
    "",
    intro,
    "",
    `Invoice: ${payload.invoiceId}`,
    `Amount: ${amount}`,
    `Date: ${payload.date}`,
    "",
    ...(lines.length ? ["Line items:", ...lines, ""] : []),
    payload.description ? `Notes: ${payload.description}` : "",
    "",
    kind === "paid" ? "" : paymentInstructions,
    "",
    closing,
    "TECHCULTURE TECHNOLOGIES PRIVATE LIMITED",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#243042;line-height:1.5;max-width:640px">
      <h2 style="margin:0 0 12px;color:#1f4e79">INVOICE ${payload.invoiceId}</h2>
      <p style="margin:0 0 16px">Hi ${payload.customerName},</p>
      <p style="margin:0 0 16px">${intro}</p>
      <table style="border-collapse:collapse;width:100%;margin:0 0 18px">
        <tr><td style="padding:8px 0;color:#7d8796">Invoice</td><td style="padding:8px 0;font-weight:700">${payload.invoiceId}</td></tr>
        <tr><td style="padding:8px 0;color:#7d8796">Amount</td><td style="padding:8px 0;font-weight:700">${amount}</td></tr>
        <tr><td style="padding:8px 0;color:#7d8796">Date</td><td style="padding:8px 0;font-weight:700">${payload.date}</td></tr>
      </table>
      ${
        lineRows
          ? `<table style="border-collapse:collapse;width:100%;margin:0 0 18px">
              <thead>
                <tr style="background:#1f4e79;color:#fff">
                  <th style="text-align:left;padding:8px">Description</th>
                  <th style="padding:8px">Qty</th>
                  <th style="text-align:right;padding:8px">Rate</th>
                  <th style="text-align:right;padding:8px">Amount</th>
                </tr>
              </thead>
              <tbody>${lineRows}</tbody>
            </table>`
          : ""
      }
      ${
        payload.description
          ? `<p style="margin:0 0 16px"><strong>Notes:</strong> ${payload.description}</p>`
          : ""
      }
      ${kind === "paid" ? "" : paymentInstructionsHtml}
      <p style="margin:0">${closing}<br/><strong>TECHCULTURE TECHNOLOGIES PRIVATE LIMITED</strong></p>
    </div>
  `;

  return { subject, text, html };
}
