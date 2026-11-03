import { COMPANY_PROFILE } from "./companyDefaults.js";

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

function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num(amount));
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

/**
 * Builds the invoice HTML email to match the on-screen invoice template.
 * Uses table layout + inline CSS for Gmail compatibility.
 */
export function buildInvoiceDocumentHtml(invoice, { kind = "payment_request" } = {}) {
  const company = COMPANY_PROFILE;
  const billTo = invoice.billTo || { name: invoice.name, address: "" };
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subTotal = calcSubTotal(items);
  const gstAmount = calcGstAmount(subTotal, invoice.gstApplicable, invoice.gstPercent);
  const grandTotal =
    invoice.amount != null && invoice.amount !== ""
      ? num(invoice.amount)
      : subTotal + gstAmount;
  const invoiceNo = invoice.invoiceNo || invoice.id;
  const status = kind === "paid" ? "Paid" : invoice.status || "Pending";

  const itemRows = items
    .map((item, index) => {
      return `<tr>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:12px;color:#314054">${index + 1}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;font-size:12px;color:#314054">${esc(item.description || "—")}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:12px;color:#314054">${num(item.qty)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:right;font-size:12px;color:#314054">${formatInr(item.rate)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e5ebf2;text-align:right;font-size:12px;color:#314054">${formatInr(lineAmount(item))}</td>
      </tr>`;
    })
    .join("");

  let intro = "";
  if (kind === "paid") {
    intro =
      "Great news! We have received and verified your payment. Your invoice is now marked as Paid.";
  } else if (kind === "reminder") {
    intro =
      "This is a friendly reminder that your invoice is still awaiting payment. Please find the invoice below.";
  } else {
    intro =
      "Please find your invoice below. Kindly complete the payment and reply to this email with your payment proof attached.";
  }

  const html = `
  <div style="margin:0;padding:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
    <div style="max-width:720px;margin:0 auto;padding:18px 12px">
      <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#445264">Hi ${esc(billTo.name || invoice.name || "Customer")},</p>
      <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#445264">${esc(intro)}</p>

      <div style="background:#ffffff;border:1px solid #e5ebf2;border-radius:12px;padding:28px 24px 20px;box-shadow:0 8px 24px rgba(23,32,51,0.06)">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-bottom:1.5px solid #111827;margin-bottom:18px">
          <tr>
            <td valign="top" style="padding:0 12px 14px 0">
              <img src="cid:tc-logo@invoice" alt="TechCulture" style="display:block;height:58px;width:auto;max-width:240px;border:0" />
              <div style="margin-top:8px;font-size:10px;line-height:1.4;color:#5b6775;max-width:280px">${esc(company.legalName)}</div>
            </td>
            <td valign="top" align="right" style="padding:0 0 14px 12px">
              <div style="font-size:30px;letter-spacing:1px;color:#1f4e79;font-weight:800;line-height:1">INVOICE</div>
              <div style="margin-top:10px;font-size:12px;color:#5b6775">Invoice Date: <strong style="color:#1f2937">${esc(formatInvoiceDate(invoice.date))}</strong></div>
              <div style="margin-top:4px;font-size:12px;color:#5b6775">Invoice No: <strong style="color:#1f2937">${esc(invoiceNo)}</strong></div>
              <div style="margin-top:4px;font-size:12px;color:#5b6775">Status: <strong style="color:#1f2937">${esc(status)}</strong></div>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
          <tr>
            <td valign="top" width="50%" style="padding:0 12px 0 0">
              <div style="font-size:11px;letter-spacing:0.8px;color:#1f4e79;font-weight:700;margin-bottom:8px">BILL FROM</div>
              <div style="font-size:13px;font-weight:700;margin-bottom:6px">${esc(company.legalName)}</div>
              <div style="font-size:11px;line-height:1.55;color:#364152">CIN: ${esc(company.cin)}</div>
              <div style="font-size:11px;line-height:1.55;color:#364152">${esc(company.address)}</div>
            </td>
            <td valign="top" width="50%" style="padding:0 0 0 12px">
              <div style="font-size:11px;letter-spacing:0.8px;color:#1f4e79;font-weight:700;margin-bottom:8px">BILL TO</div>
              <div style="font-size:13px;font-weight:700;margin-bottom:6px">${esc(billTo.name || "—")}</div>
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
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:14px">
          <thead>
            <tr style="background:#1f4e79;color:#ffffff">
              <th style="padding:10px;text-align:center;font-size:11px;width:48px">Sl</th>
              <th style="padding:10px;text-align:left;font-size:11px">Description</th>
              <th style="padding:10px;text-align:center;font-size:11px;width:70px">Qty</th>
              <th style="padding:10px;text-align:right;font-size:11px;width:110px">Rate (INR)</th>
              <th style="padding:10px;text-align:right;font-size:11px;width:120px">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows || `<tr><td colspan="5" style="padding:12px;text-align:center;color:#7d8796;font-size:12px">No line items</td></tr>`}
          </tbody>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px">
          <tr>
            <td></td>
            <td width="260" style="background:#edf4fb;border:1px solid #d6e6f5;border-radius:8px;padding:10px 12px">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                <tr>
                  <td style="padding:4px 0;font-size:12px;color:#5b6775">Sub Total</td>
                  <td style="padding:4px 0;font-size:12px;text-align:right;font-weight:700">${formatInr(subTotal)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:12px;color:#5b6775">GST</td>
                  <td style="padding:4px 0;font-size:12px;text-align:right;font-weight:700">${invoice.gstApplicable ? formatInr(gstAmount) : esc(invoice.gstNote || "Not Applicable")}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0 2px;font-size:13px;color:#1f4e79;font-weight:800;border-top:1px solid #c9daf0">Grand Total</td>
                  <td style="padding:8px 0 2px;font-size:13px;text-align:right;color:#1f4e79;font-weight:800;border-top:1px solid #c9daf0">${formatInr(grandTotal)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 16px;font-size:12px;color:#364152">Amount Chargeable (in words): <strong>${esc(amountInWords(grandTotal))}</strong></p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
          <tr>
            <td valign="top" style="padding:0 0 12px 0">
              <div style="border:1px solid #d6e6f5;background:#f7fbfe;border-radius:8px;padding:12px">
                <div style="font-size:11px;letter-spacing:0.6px;color:#1f4e79;font-weight:800;margin-bottom:8px">BANK DETAILS</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">Beneficiary Name: ${esc(company.bank.beneficiaryName)}</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">Bank Name: ${esc(company.bank.bankName)}</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">Branch: ${esc(company.bank.branch)}</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">Account Type: ${esc(company.bank.accountType)}</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">Account No.: ${esc(company.bank.accountNo)}</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">IFSC Code: ${esc(company.bank.ifsc)}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td valign="top" style="padding:0">
              <div style="border:1px solid #d6e6f5;background:#f7fbfe;border-radius:8px;padding:12px">
                <div style="font-size:11px;letter-spacing:0.6px;color:#1f4e79;font-weight:800;margin-bottom:8px">DECLARATION</div>
                <div style="font-size:11px;line-height:1.55;color:#364152">${esc(company.declaration)}</div>
                ${invoice.notes ? `<div style="margin-top:10px;font-size:11px;line-height:1.55;color:#364152">Notes: ${esc(invoice.notes)}</div>` : ""}
              </div>
            </td>
          </tr>
        </table>

        <div style="width:100%;margin-top:8px">
          <img src="cid:tc-sign@invoice" alt="Authorised Signatory" style="display:block;width:100%;max-width:100%;height:auto;border:0" />
          <div style="margin-top:6px;font-size:10px;color:#7b8796">${esc(formatInvoiceDate(invoice.date))}</div>
        </div>
      </div>

      ${
        kind === "paid"
          ? ""
          : `<div style="margin-top:16px;padding:14px 16px;border:1px solid #ffe0cb;border-radius:10px;background:#fff8f2">
              <div style="font-weight:700;color:#c65b0a;margin-bottom:8px;font-size:13px">How to complete payment</div>
              <ol style="margin:0;padding-left:18px;color:#445264;font-size:12px;line-height:1.55">
                <li>Make the payment for this invoice using the bank details above.</li>
                <li>Reply to this email with your payment proof attached (screenshot / receipt).</li>
                <li>We will verify the payment and mark your invoice as Paid.</li>
              </ol>
            </div>`
      }

      <p style="margin:18px 0 0;font-size:12px;color:#5b6775">Thank you,<br/><strong>TECHCULTURE TECHNOLOGIES PRIVATE LIMITED</strong></p>
    </div>
  </div>`;

  const subject =
    kind === "paid"
      ? `Payment confirmed — Invoice ${invoiceNo}`
      : kind === "reminder"
        ? `Reminder: Invoice ${invoiceNo} is still ${status}`
        : `Invoice ${invoiceNo} from TechCulture Technologies`;

  const text = [
    `Hi ${billTo.name || invoice.name || "Customer"},`,
    "",
    intro,
    "",
    `Invoice: ${invoiceNo}`,
    `Amount: ${formatInr(grandTotal)}`,
    `Status: ${status}`,
    `Date: ${formatInvoiceDate(invoice.date)}`,
    "",
    "Please view the HTML version of this email for the full invoice.",
    "",
    "TECHCULTURE TECHNOLOGIES PRIVATE LIMITED",
  ].join("\n");

  return { subject, text, html, grandTotal, invoiceNo };
}
