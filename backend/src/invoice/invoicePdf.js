import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import { COMPANY_PROFILE, resolveCompanyProfile } from "./companyDefaults.js";

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

function normalizeStateCode(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  const fromParens = text.match(/\((\d{1,2})\)/);
  if (fromParens) return fromParens[1].padStart(2, "0");
  if (/^\d{1,2}$/.test(text)) return text.padStart(2, "0");
  if (/^\d{2}[A-Z]/i.test(text)) return text.slice(0, 2);
  return "";
}

/** Same state → CGST+SGST; different state → IGST. */
function resolveGstBreakdown(invoice, subTotal) {
  const gstPercent = num(invoice.gstPercent);
  if (!invoice.gstApplicable || gstPercent <= 0) {
    return { mode: "none", gstPercent, halfPercent: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 };
  }
  const sellerCode = normalizeStateCode(COMPANY_PROFILE.stateCode || "07");
  const buyerCode =
    normalizeStateCode(invoice.billTo?.stateCode) ||
    normalizeStateCode(invoice.placeOfSupply) ||
    normalizeStateCode(invoice.billTo?.gstin);
  const totalGst = calcGstAmount(subTotal, true, gstPercent);
  const sameState = Boolean(sellerCode && buyerCode && sellerCode === buyerCode);
  if (!buyerCode || sameState) {
    const halfPercent = gstPercent / 2;
    const half = calcGstAmount(subTotal, true, halfPercent);
    return { mode: "cgst_sgst", gstPercent, halfPercent, cgst: half, sgst: half, igst: 0, totalGst };
  }
  return { mode: "igst", gstPercent, halfPercent: 0, cgst: 0, sgst: 0, igst: totalGst, totalGst };
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

function drawWrapped(doc, text, x, y, width, options = {}) {
  const height = doc.heightOfString(String(text || ""), { width, ...options });
  doc.text(String(text || ""), x, y, { width, ...options });
  return height;
}

/**
 * Builds invoice PDF with pdfkit — Status field is intentionally omitted.
 */
export async function renderInvoicePdfBuffer(invoice, opts = {}) {
  const company = resolveCompanyProfile(opts.company || opts.settings || {});
  const billTo = invoice.billTo || { name: invoice.name, address: "" };
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subTotal = calcSubTotal(items);
  const gst = resolveGstBreakdown(invoice, subTotal);
  const grandTotal = calcGrandTotal(invoice);
  const invoiceNo = invoice.invoiceNo || invoice.id || "—";
  const logoPath = path.join(ASSETS_DIR, "techculture-logo.png");
  const signPath = path.join(ASSETS_DIR, "SIGNETURE.png");

  const doc = new PDFDocument({
    size: "A4",
    margin: 36,
    info: {
      Title: `Invoice ${invoiceNo}`,
      Author: company.legalName,
    },
  });

  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const pageWidth = doc.page.width;
  const left = 36;
  const right = pageWidth - 36;
  const contentWidth = right - left;
  let y = 36;

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, left, y, { height: 42 });
    } catch {
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#111111").text("TECH CULTURE", left, y);
    }
  } else {
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#111111").text("TECH CULTURE", left, y);
  }

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#5b6775")
    .text(company.legalName, left, y + 48, { width: 280 });

  // CIN + address under company name, above black line
  let companyBlockY = y + 62;
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  companyBlockY += drawWrapped(doc, `CIN: ${company.cin}`, left, companyBlockY, 300) + 1;
  companyBlockY += drawWrapped(doc, company.address, left, companyBlockY, 300);

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#111111")
    .text("INVOICE", left, y + 8, { width: contentWidth, align: "right" });

  y = Math.max(companyBlockY, y + 70) + 10;
  doc
    .moveTo(left, y)
    .lineTo(right, y)
    .strokeColor("#111827")
    .lineWidth(1.2)
    .stroke();
  y += 12;

  // Meta grid
  const metaH = 62;
  doc.roundedRect(left, y, contentWidth, metaH, 4).fillAndStroke("#f8fafc", "#cfd8e3");
  const metaCol = contentWidth / 2 - 10;
  const metaLeft = [
    `Invoice No.: ${invoiceNo}`,
    `Invoice Date: ${formatInvoiceDate(invoice.date)}`,
    `Due Date: ${formatInvoiceDate(invoice.dueDate)}`,
  ];
  const metaRight = [
    `Place of Supply: ${invoice.placeOfSupply || "Delhi (07)"}`,
    `Account Manager: ${invoice.accountManager || "—"}`,
    `Invoice Duration: ${invoice.invoiceDuration || "—"}`,
  ];
  doc.font("Helvetica").fontSize(9).fillColor("#364152");
  let my = y + 10;
  for (const line of metaLeft) {
    doc.text(line, left + 10, my, { width: metaCol });
    my += 14;
  }
  my = y + 10;
  for (const line of metaRight) {
    doc.text(line, left + metaCol + 20, my, { width: metaCol });
    my += 14;
  }
  y += metaH + 14;

  // BILL TO — single inline row
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("BILL TO", left, y);
  y += 14;
  const billToParts = [billTo.name || "—"];
  if (billTo.address) billToParts.push(String(billTo.address).replace(/\s*\n\s*/g, ", "));
  if (billTo.gstin) billToParts.push(`GST number: ${billTo.gstin}`);
  if (billTo.stateName) {
    billToParts.push(
      `State Name: ${billTo.stateName}${billTo.stateCode ? `, Code: ${billTo.stateCode}` : ""}`,
    );
  }
  if (billTo.cin) billToParts.push(`CIN: ${billTo.cin}`);
  if (billTo.email) billToParts.push(`E-Mail: ${billTo.email}`);
  if (billTo.phone) billToParts.push(`Phone: ${billTo.phone}`);
  doc.font("Helvetica").fontSize(9).fillColor("#364152");
  y += drawWrapped(doc, billToParts.join(" · "), left, y, contentWidth) + 14;

  const cols = [
    { label: "Sl", width: 28, align: "center" },
    { label: "Description", width: contentWidth - 28 - 70 - 42 - 70 - 78, align: "left" },
    { label: "HSN/SAC", width: 70, align: "center" },
    { label: "Qty", width: 42, align: "center" },
    { label: "Rate", width: 70, align: "right" },
    { label: "Amount", width: 78, align: "right" },
  ];

  doc.rect(left, y, contentWidth, 22).fill("#1f4e79");
  let x = left;
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff");
  for (const col of cols) {
    doc.text(col.label, x + 3, y + 7, { width: col.width - 6, align: col.align });
    x += col.width;
  }
  y += 22;

  doc.font("Helvetica").fontSize(8).fillColor("#314054");
  if (!items.length) {
    doc.text("No line items", left, y + 8, { width: contentWidth, align: "center" });
    y += 28;
  } else {
    items.forEach((item, index) => {
      const rowH = Math.max(
        22,
        doc.heightOfString(item.description || "—", { width: cols[1].width - 6 }) + 10,
      );
      if (y + rowH > doc.page.height - 72) {
        doc.addPage();
        y = 36;
      }
      x = left;
      const values = [
        String(index + 1),
        item.description || "—",
        item.hsnSac || "—",
        String(num(item.qty)),
        formatInr(item.rate),
        formatInr(lineAmount(item)),
      ];
      values.forEach((value, i) => {
        doc.text(value, x + 3, y + 6, {
          width: cols[i].width - 6,
          align: cols[i].align,
        });
        x += cols[i].width;
      });
      y += rowH;
      doc
        .moveTo(left, y)
        .lineTo(right, y)
        .strokeColor("#e5ebf2")
        .lineWidth(0.6)
        .stroke();
    });
  }

  y += 12;
  const boxW = 230;
  const boxX = right - boxW;
  const totalsH = gst.mode === "cgst_sgst" ? 96 : gst.mode === "igst" ? 80 : 70;
  if (y + totalsH > doc.page.height - 80) {
    doc.addPage();
    y = 36;
  }

  doc.roundedRect(boxX, y, boxW, totalsH, 6).fillAndStroke("#edf4fb", "#d6e6f5");
  let ty = y + 10;
  const row = (label, value, bold = false) => {
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 10 : 9)
      .fillColor(bold ? "#1f4e79" : "#5b6775")
      .text(label, boxX + 12, ty);
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica-Bold")
      .fillColor(bold ? "#1f4e79" : "#1f2937")
      .text(value, boxX + 12, ty, { width: boxW - 24, align: "right" });
    ty += 16;
  };

  row("Taxable Amount", formatInr(subTotal));
  if (gst.mode === "cgst_sgst") {
    row(`CGST${gst.halfPercent} (${gst.halfPercent}%)`, formatInr(gst.cgst));
    row(`SGST${gst.halfPercent} (${gst.halfPercent}%)`, formatInr(gst.sgst));
  } else if (gst.mode === "igst") {
    row(`IGST${gst.gstPercent} (${gst.gstPercent}%)`, formatInr(gst.igst));
  } else {
    row("GST", invoice.gstNote || "Not Applicable");
  }
  doc
    .moveTo(boxX + 12, ty - 2)
    .lineTo(boxX + boxW - 12, ty - 2)
    .strokeColor("#c9daf0")
    .stroke();
  ty += 4;
  row("Total", formatInr(grandTotal), true);

  y += totalsH + 12;
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#364152")
    .text(`Amount Chargeable (in words): ${amountInWords(grandTotal)}`, left, y, {
      width: contentWidth,
    });

  y += 26;
  const bankLines = [
    `Beneficiary Name: ${company.bank.beneficiaryName}`,
    `Bank Name: ${company.bank.bankName}`,
    `Branch: ${company.bank.branch}`,
    `Account Type: ${company.bank.accountType}`,
    `Account No.: ${company.bank.accountNo}`,
    `IFSC Code: ${company.bank.ifsc}`,
  ];
  const bankBoxH = 24 + bankLines.length * 12 + 8;
  const declTextH = doc.heightOfString(company.declaration, { width: contentWidth - 20 });
  const notesH = invoice.notes
    ? doc.heightOfString(`Notes: ${invoice.notes}`, { width: contentWidth - 20 }) + 8
    : 0;
  const declBoxH = 24 + declTextH + notesH + 12;

  if (y + bankBoxH + declBoxH + 20 > doc.page.height - 60) {
    doc.addPage();
    y = 36;
  }

  // BANK DETAILS — full row
  doc.roundedRect(left, y, contentWidth, bankBoxH, 6).fillAndStroke("#f7fbfe", "#d6e6f5");
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("BANK DETAILS", left + 10, y + 10);
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  let by = y + 24;
  for (const line of bankLines) {
    by += drawWrapped(doc, line, left + 10, by, contentWidth - 20) + 2;
  }
  y += bankBoxH + 10;

  // DECLARATION — next row
  if (y + declBoxH > doc.page.height - 60) {
    doc.addPage();
    y = 36;
  }
  doc.roundedRect(left, y, contentWidth, declBoxH, 6).fillAndStroke("#f7fbfe", "#d6e6f5");
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("DECLARATION", left + 10, y + 10);
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  let dy = y + 24;
  dy += drawWrapped(doc, company.declaration, left + 10, dy, contentWidth - 20) + 6;
  if (invoice.notes) {
    drawWrapped(doc, `Notes: ${invoice.notes}`, left + 10, dy, contentWidth - 20);
  }
  y += declBoxH + 18;
  if (y + 120 > doc.page.height - 40) {
    doc.addPage();
    y = 36;
  }

  const signBlockW = 240;
  const signX = right - signBlockW;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text("For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED", signX, y, {
      width: signBlockW,
      align: "right",
    });
  y += 28;

  if (fs.existsSync(signPath)) {
    try {
      doc.image(signPath, signX + 40, y, { width: 180, height: 56, fit: [180, 56] });
      y += 62;
    } catch {
      y += 20;
    }
  } else {
    y += 20;
  }

  doc
    .moveTo(signX + 40, y)
    .lineTo(right, y)
    .strokeColor("#cfd8e3")
    .lineWidth(0.8)
    .stroke();
  y += 8;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text("Authorised Signatory", signX, y, { width: signBlockW, align: "right" });
  y += 16;

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#7b8796")
    .text(formatInvoiceDate(invoice.date), signX, y, { width: signBlockW, align: "right" });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

export function invoicePdfFilename(invoice) {
  const raw = String(invoice.invoiceNo || invoice.id || "invoice")
    .replaceAll(/[^\w.-]+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
  return `Invoice-${raw || "document"}.pdf`;
}
