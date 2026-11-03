import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolveCompanyProfile } from "./companyDefaults.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "assets");

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function lineAmount(item) {
  return num(item.qty) * num(item.rate);
}

function calcSubTotal(items = []) {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

function calcGstAmount(subTotal, gstApplicable, gstPercent) {
  if (!gstApplicable) return 0;
  return (subTotal * num(gstPercent)) / 100;
}

function calcGrandTotal(invoice) {
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subTotal = calcSubTotal(items);
  const gstAmount = calcGstAmount(subTotal, invoice.gstApplicable, invoice.gstPercent);
  if (invoice.amount != null && invoice.amount !== "") return num(invoice.amount);
  return subTotal + gstAmount;
}

function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num(amount));
}

function formatMoney(amount) {
  return `₹${formatInr(amount)}`;
}

function formatInvoiceDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSlashDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return String(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function addDays(dateStr, days) {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function daysBetween(fromStr, toDate = new Date()) {
  const from = new Date(fromStr);
  if (Number.isNaN(from.getTime())) return 0;
  const ms = toDate.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

function durationLabel(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return `${TENS[ten]}${one ? ` ${ONES[one]}` : ""}`.trim();
}

function threeDigits(n) {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (hundred && rest) return `${ONES[hundred]} Hundred ${twoDigits(rest)}`;
  if (hundred) return `${ONES[hundred]} Hundred`;
  return twoDigits(rest);
}

function amountInWords(amount) {
  const value = Math.round(num(amount));
  if (value === 0) return "Rupees Zero Only";
  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = value % 1000;
  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return `Rupees ${parts.join(" ")} Only`;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nl2br(value) {
  return esc(value).replaceAll("\n", "<br/>");
}

function assetDataUri(filename) {
  const full = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(full)) return "";
  const buf = fs.readFileSync(full);
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function customerName(invoice) {
  return invoice.billTo?.name || invoice.name || "Customer";
}

function serviceName(invoice) {
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const names = items.map((i) => String(i.description || "").trim()).filter(Boolean);
  return names.length ? names.join(", ") : "Invoice services";
}

function invoiceMeta(invoice, extras = {}) {
  const company = resolveCompanyProfile(extras.company || extras.settings || {});
  const grandTotal = calcGrandTotal(invoice);
  const invoiceNo = invoice.invoiceNo || invoice.id;
  const dueDays = Number(extras.dueDays || 15);
  const dueDate = extras.dueDate || invoice.dueDate || addDays(invoice.date, dueDays);
  const overdueDays =
    extras.overdueDays != null
      ? Number(extras.overdueDays)
      : daysBetween(dueDate);
  const outstanding =
    extras.outstanding != null ? num(extras.outstanding) : grandTotal;
  const balanceDue =
    extras.balanceDue != null ? num(extras.balanceDue) : Math.max(0, outstanding - grandTotal);

  return {
    company,
    grandTotal,
    invoiceNo,
    dueDate,
    overdueDays,
    outstanding,
    balanceDue,
    service: serviceName(invoice),
    duration: invoice.invoiceDuration || durationLabel(invoice.date),
    name: customerName(invoice),
    paymentDate: extras.paymentDate || new Date().toISOString().slice(0, 10),
  };
}

function wrapEmail(bodyHtml) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px">${bodyHtml}</div>
</body></html>`;
}

function buildPaymentRequestCover(meta) {
  return wrapEmail(`
    <p style="margin:0 0 10px;font-size:15px;color:#222">Dear ${esc(meta.name)},</p>
    <p style="margin:0 0 8px;font-size:15px;color:#222">Greetings from ${esc(meta.company.brandName)} !!</p>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#333">
      Please find the attached soft copy of the invoice as per the following details:
    </p>
    <div style="background:#fbf6e9;border:1px solid #d8c9a8;border-radius:4px;padding:22px 20px;text-align:center">
      <div style="font-size:12px;letter-spacing:0.6px;font-weight:700;color:#333;margin-bottom:8px">INVOICE AMOUNT</div>
      <div style="font-size:28px;font-weight:800;color:#c1121f;line-height:1.2">${esc(formatMoney(meta.grandTotal))}</div>
      <div style="margin-top:8px;font-size:14px;font-weight:700;color:#111">Duration ${esc(meta.duration)}</div>
      <div style="margin:16px 0;border-top:1px solid #c9b78f"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;text-align:left">
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#666">Invoice No.</td>
          <td style="padding:7px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(meta.invoiceNo)}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#666">Invoice Date</td>
          <td style="padding:7px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(formatSlashDate(meta.invoiceDate))}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#666;vertical-align:top">Service Name</td>
          <td style="padding:7px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(meta.service)}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#666">Due Date</td>
          <td style="padding:7px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(formatSlashDate(meta.dueDate))}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#666">Total Outstanding</td>
          <td style="padding:7px 0;font-size:13px;font-weight:800;color:#c1121f;text-align:right">${esc(formatMoney(meta.outstanding))}</td>
        </tr>
      </table>
    </div>
  `);
}

function buildReminderCover(meta) {
  const detailRow = (label, value, valueColor = "#111827") => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:#6b7280;border-bottom:1px solid #f3e8d8">${esc(label)}</td>
      <td style="padding:10px 0;font-size:13px;font-weight:700;color:${valueColor};text-align:right;border-bottom:1px solid #f3e8d8">${value}</td>
    </tr>`;

  return wrapEmail(`
    <div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(23,32,51,0.06)">
      <div style="padding:22px 24px 8px;border-bottom:1px solid #f3e4d4">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td valign="middle" style="padding:0">
              <img src="cid:tc-logo@invoice" alt="TechCulture" style="display:block;height:48px;width:auto;max-width:200px;border:0" />
            </td>
            <td valign="middle" align="right" style="padding:0 0 0 12px">
              <div style="font-size:24px;font-weight:800;color:#111111;line-height:1.2;letter-spacing:0.5px">Invoice</div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:20px 24px 8px">
        <p style="margin:0 0 10px;font-size:15px;color:#111827">Dear ${esc(meta.name)},</p>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#4b5563">
          Please find attached the invoice for your reference. We kindly request you to process the payment at your convenience.
        </p>
      </div>

      <div style="margin:0 24px 20px;background:#fff7ed;border:1px solid #fdba74;border-radius:12px;padding:20px 18px;text-align:center">
        <div style="font-size:11px;letter-spacing:0.8px;font-weight:700;color:#9a3412;margin-bottom:8px">AMOUNT DUE</div>
        <div style="font-size:30px;font-weight:800;color:#c1121f;line-height:1.15">${esc(formatMoney(meta.grandTotal))}</div>
        <div style="margin-top:12px;padding:6px 12px;border-radius:999px;background:#ffedd5;color:#9a3412;font-size:12px;font-weight:700;display:inline-block">
          Overdue by ${esc(String(meta.overdueDays))} day${Number(meta.overdueDays) === 1 ? "" : "s"}
        </div>
      </div>

      <div style="margin:0 24px 22px;background:#fffbeb;border:1px solid #f5e6c8;border-radius:12px;padding:8px 18px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${detailRow("Invoice No", esc(meta.invoiceNo))}
          ${detailRow("Invoice Date", esc(formatSlashDate(meta.invoiceDate)))}
          ${detailRow("Due Date", esc(formatSlashDate(meta.dueDate)), "#b45309")}
          ${detailRow("Overdue Days", esc(String(meta.overdueDays)), "#c2410c")}
          ${detailRow("Amount", esc(formatMoney(meta.grandTotal)), "#c1121f")}
          <tr>
            <td style="padding:12px 0 8px;font-size:13px;font-weight:700;color:#374151">Total Outstanding Balance</td>
            <td style="padding:12px 0 8px;font-size:15px;font-weight:800;color:#c1121f;text-align:right">${esc(formatMoney(meta.outstanding))}</td>
          </tr>
        </table>
      </div>

      <div style="margin:0 24px 22px;padding:14px 16px;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px">
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#9f1239;font-weight:700">Action needed</p>
        <p style="margin:0;font-size:13px;line-height:1.65;color:#4b5563">
          It would be greatly appreciated if you could make the payment as soon as possible.
          If you have any questions or concerns regarding the invoice, please do not hesitate to contact us.
        </p>
      </div>

      <div style="padding:0 24px 22px">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280">
          The invoice PDF is attached for your reference.<br/>
          Thank you,<br/>
          <strong style="color:#111827">${esc(meta.company.legalName)}</strong>
        </p>
      </div>
    </div>
  `);
}

function buildPaidCover(meta) {
  return wrapEmail(`
    <p style="margin:0 0 14px;font-size:15px;color:#374151">Dear ${esc(meta.name)} ,</p>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#4b5563">
      Thank you for your payment and we have processed it accordingly. The payment receipt is attached for your reference.
      If you have any questions or concerns about your payment or our products/services, please don't hesitate to reach out to us.
    </p>
    <div style="background:#fbf6e9;border:1px solid #d8c9a8;border-radius:4px;padding:22px 20px;text-align:center;max-width:420px;margin:0 auto">
      <div style="font-size:16px;font-weight:700;color:#374151;margin-bottom:10px">Payment Received</div>
      <div style="font-size:28px;font-weight:800;color:#15803d;line-height:1.2">${esc(formatMoney(meta.grandTotal))}</div>
      <div style="margin:16px 0;border-top:1px solid #d1d5db"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;text-align:left">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#6b7280">Invoice No.</td>
          <td style="padding:8px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(meta.invoiceNo)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#6b7280">Payment Date</td>
          <td style="padding:8px 0;font-size:13px;font-weight:700;color:#111;text-align:right">${esc(formatSlashDate(meta.paymentDate))}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#6b7280">Balance Due</td>
          <td style="padding:8px 0;font-size:13px;font-weight:800;color:#c1121f;text-align:right">${esc(formatMoney(meta.balanceDue))}</td>
        </tr>
      </table>
    </div>
  `);
}

/**
 * Cover-letter style email body (images 2/3/4). Invoice PDF is attached separately.
 */
export function buildInvoiceCoverEmail(invoice, { kind = "payment_request", extras = {} } = {}) {
  const meta = {
    ...invoiceMeta(invoice, extras),
    invoiceDate: invoice.date,
  };

  let html;
  let subject;
  let text;

  if (kind === "paid") {
    html = buildPaidCover(meta);
    subject = `Payment received — Invoice ${meta.invoiceNo}`;
    text = [
      `Dear ${meta.name},`,
      "",
      "Thank you for your payment. The payment receipt / invoice PDF is attached.",
      `Invoice No: ${meta.invoiceNo}`,
      `Amount: ${formatMoney(meta.grandTotal)}`,
      `Payment Date: ${formatSlashDate(meta.paymentDate)}`,
      `Balance Due: ${formatMoney(meta.balanceDue)}`,
    ].join("\n");
  } else if (kind === "reminder") {
    html = buildReminderCover(meta);
    subject = `Payment reminder — Invoice ${meta.invoiceNo}`;
    text = [
      `Dear ${meta.name},`,
      "",
      "Please find attached the invoice for your reference. We kindly request you to process the payment at your convenience.",
      `Invoice No: ${meta.invoiceNo}`,
      `Invoice Date: ${formatSlashDate(meta.invoiceDate)}`,
      `Due Date: ${formatSlashDate(meta.dueDate)}`,
      `Overdue Days: ${meta.overdueDays}`,
      `Amount: ${formatMoney(meta.grandTotal)}`,
      `Total Outstanding Balance: ${formatMoney(meta.outstanding)}`,
      "",
      "Invoice PDF is attached.",
    ].join("\n");
  } else {
    html = buildPaymentRequestCover(meta);
    subject = `Invoice ${meta.invoiceNo} from ${meta.company.brandName}`;
    text = [
      `Dear ${meta.name},`,
      "",
      `Greetings from ${meta.company.brandName} !!`,
      "Please find the attached soft copy of the invoice.",
      `Invoice Amount: ${formatMoney(meta.grandTotal)}`,
      `Invoice No: ${meta.invoiceNo}`,
      `Invoice Date: ${formatSlashDate(meta.invoiceDate)}`,
      `Due Date: ${formatSlashDate(meta.dueDate)}`,
      `Total Outstanding: ${formatMoney(meta.outstanding)}`,
    ].join("\n");
  }

  return { subject, text, html, grandTotal: meta.grandTotal, invoiceNo: meta.invoiceNo };
}

/**
 * Full invoice HTML for PDF generation — no Status field.
 */
export function buildInvoicePdfHtml(invoice, opts = {}) {
  const company = resolveCompanyProfile(opts.company || opts.settings || {});
  const billTo = invoice.billTo || { name: invoice.name, address: "" };
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subTotal = calcSubTotal(items);
  const gstAmount = calcGstAmount(subTotal, invoice.gstApplicable, invoice.gstPercent);
  const grandTotal = calcGrandTotal(invoice);
  const invoiceNo = invoice.invoiceNo || invoice.id;
  const logoUri = assetDataUri("techculture-logo.png");
  const signUri = assetDataUri("SIGNETURE.png");

  const itemRows = items
    .map((item, index) => {
      return `<tr>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:12px;color:#314054">${index + 1}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;font-size:12px;color:#314054">${esc(item.description || "—")}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:12px;color:#314054">${esc(item.hsnSac || "—")}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:12px;color:#314054">${num(item.qty)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:right;font-size:12px;color:#314054">${formatInr(item.rate)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:right;font-size:12px;color:#314054">${formatInr(lineAmount(item))}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 28px; font-family: Arial, Helvetica, sans-serif; color: #1f2937; background: #fff; }
</style></head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-bottom:1.5px solid #111827;margin-bottom:14px">
    <tr>
      <td valign="top" style="padding:0 12px 14px 0">
        ${logoUri ? `<img src="${logoUri}" alt="TechCulture" style="display:block;height:58px;width:auto;max-width:240px;border:0" />` : `<div style="font-size:20px;font-weight:800;color:#1f4e79">TECH CULTURE</div>`}
        <div style="margin-top:8px;font-size:10px;line-height:1.4;color:#5b6775;max-width:320px">${esc(company.legalName)}</div>
        <div style="margin-top:4px;font-size:10px;line-height:1.45;color:#364152;max-width:360px">
          <div>CIN: ${esc(company.cin)}</div>
          <div>${esc(company.address)}</div>
        </div>
      </td>
      <td valign="top" align="right" style="padding:0 0 14px 12px">
        <div style="font-size:30px;letter-spacing:1px;color:#111111;font-weight:800;line-height:1">INVOICE</div>
      </td>
    </tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 18px">
    <tr>
      <td valign="top" width="48%" style="padding:0 14px 0 0">
        <div style="font-size:11px;letter-spacing:0.8px;color:#1f4e79;font-weight:700;margin-bottom:8px">BILL TO</div>
        <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:6px">${esc(billTo.name || "—")}</div>
        ${billTo.address ? `<div style="font-size:11px;line-height:1.55;color:#364152">${nl2br(billTo.address)}</div>` : ""}
        ${billTo.gstin ? `<div style="font-size:11px;line-height:1.55;color:#364152">GST number: ${esc(billTo.gstin)}</div>` : ""}
        ${
          billTo.stateName
            ? `<div style="font-size:11px;line-height:1.55;color:#364152">State Name: ${esc(billTo.stateName)}${billTo.stateCode ? `, Code: ${esc(billTo.stateCode)}` : ""}</div>`
            : ""
        }
        ${billTo.email ? `<div style="font-size:11px;line-height:1.55;color:#364152">E-Mail: ${esc(billTo.email)}</div>` : ""}
        ${billTo.phone ? `<div style="font-size:11px;line-height:1.55;color:#364152">Phone: ${esc(billTo.phone)}</div>` : ""}
      </td>
      <td valign="top" width="52%" style="padding:0 0 0 6px">
        <div style="background:#f8fafc;border:1px solid #cfd8e3;border-radius:8px;padding:12px 14px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tr>
              <td valign="top" style="padding:4px 8px 4px 0;font-size:11px;line-height:1.45;color:#5b6775;width:50%">Invoice No.: <strong style="color:#1f2937">${esc(invoiceNo)}</strong></td>
              <td valign="top" style="padding:4px 0;font-size:11px;line-height:1.45;color:#5b6775;width:50%">Place of Supply: <strong style="color:#1f2937">${esc(invoice.placeOfSupply || "Delhi (07)")}</strong></td>
            </tr>
            <tr>
              <td valign="top" style="padding:4px 8px 4px 0;font-size:11px;line-height:1.45;color:#5b6775">Invoice Date: <strong style="color:#1f2937">${esc(formatInvoiceDate(invoice.date))}</strong></td>
              <td valign="top" style="padding:4px 0;font-size:11px;line-height:1.45;color:#5b6775">Account Manager: <strong style="color:#1f2937">${esc(invoice.accountManager || "—")}</strong></td>
            </tr>
            <tr>
              <td valign="top" style="padding:4px 8px 4px 0;font-size:11px;line-height:1.45;color:#5b6775">Due Date: <strong style="color:#1f2937">${esc(formatInvoiceDate(invoice.dueDate))}</strong></td>
              <td valign="top" style="padding:4px 0;font-size:11px;line-height:1.45;color:#5b6775">Invoice Duration: <strong style="color:#1f2937">${esc(invoice.invoiceDuration || "—")}</strong></td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:14px">
    <thead>
      <tr style="background:#1f4e79;color:#ffffff">
        <th style="padding:10px;text-align:center;font-size:11px;width:40px">Sl</th>
        <th style="padding:10px;text-align:left;font-size:11px">Description</th>
        <th style="padding:10px;text-align:center;font-size:11px;width:70px">HSN/SAC</th>
        <th style="padding:10px;text-align:center;font-size:11px;width:50px">Qty</th>
        <th style="padding:10px;text-align:right;font-size:11px;width:90px">Rate</th>
        <th style="padding:10px;text-align:right;font-size:11px;width:100px">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows || `<tr><td colspan="6" style="padding:12px;text-align:center;color:#7d8796;font-size:12px">No line items</td></tr>`}
    </tbody>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
    <tr>
      <td valign="top" style="padding:8px 12px 0 0;font-size:12px;color:#364152">
        Amount Chargeable (in words): <strong>${esc(amountInWords(grandTotal))}</strong>
      </td>
      <td width="260" valign="top" style="background:#edf4fb;border:1px solid #d6e6f5;border-radius:8px;padding:10px 12px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td style="padding:4px 0;font-size:12px;color:#5b6775">Taxable Amount</td>
            <td style="padding:4px 0;font-size:12px;text-align:right;font-weight:700">${formatInr(subTotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:12px;color:#5b6775">GST</td>
            <td style="padding:4px 0;font-size:12px;text-align:right;font-weight:700">${invoice.gstApplicable ? formatInr(gstAmount) : esc(invoice.gstNote || "Not Applicable")}</td>
          </tr>
          <tr>
            <td style="padding:8px 0 2px;font-size:13px;color:#1f4e79;font-weight:800;border-top:1px solid #c9daf0">Total</td>
            <td style="padding:8px 0 2px;font-size:13px;text-align:right;color:#1f4e79;font-weight:800;border-top:1px solid #c9daf0">${formatInr(grandTotal)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    <tr>
      <td valign="top" width="62%" style="padding:0 14px 0 0">
        <div style="border:1px solid #d6e6f5;background:#f7fbfe;border-radius:8px;padding:12px;margin-bottom:12px">
          <div style="font-size:11px;letter-spacing:0.6px;color:#1f4e79;font-weight:800;margin-bottom:8px">BANK DETAILS</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">Beneficiary Name: ${esc(company.bank.beneficiaryName)}</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">Bank Name: ${esc(company.bank.bankName)}</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">Branch: ${esc(company.bank.branch)}</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">Account Type: ${esc(company.bank.accountType)}</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">Account No.: ${esc(company.bank.accountNo)}</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">IFSC Code: ${esc(company.bank.ifsc)}</div>
        </div>
        <div style="border:1px solid #d6e6f5;background:#f7fbfe;border-radius:8px;padding:12px">
          <div style="font-size:11px;letter-spacing:0.6px;color:#1f4e79;font-weight:800;margin-bottom:8px">DECLARATION</div>
          <div style="font-size:11px;line-height:1.55;color:#364152">${esc(company.declaration)}</div>
          ${invoice.notes ? `<div style="margin-top:10px;font-size:11px;line-height:1.55;color:#364152">Notes: ${esc(invoice.notes)}</div>` : ""}
        </div>
      </td>
      <td valign="top" width="38%" align="right" style="padding:0">
        <div style="display:inline-block;text-align:right;max-width:240px">
          <div style="font-size:11px;font-weight:700;color:#111827;margin-bottom:8px">For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED</div>
          ${signUri ? `<img src="${signUri}" alt="Signature" style="display:block;margin:0 0 6px auto;height:56px;width:auto;max-width:200px;border:0" />` : ""}
          <div style="border-top:1px solid #cfd8e3;padding-top:8px;font-size:12px;font-weight:700;color:#111827">Authorised Signatory</div>
          <div style="margin-top:6px;font-size:10px;color:#7b8796">${esc(formatInvoiceDate(invoice.date))}</div>
        </div>
      </td>
    </tr>
  </table>
</body></html>`;
}

/** @deprecated Use buildInvoiceCoverEmail + PDF attachment */
export function buildInvoiceDocumentHtml(invoice, opts = {}) {
  return buildInvoiceCoverEmail(invoice, opts);
}
