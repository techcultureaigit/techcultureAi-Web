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
  y += 14;

  // BILL TO (left) + invoice meta box (right) — reference layout
  const gap = 16;
  const billW = Math.floor(contentWidth * 0.46);
  const metaW = contentWidth - billW - gap;
  const metaX = left + billW + gap;

  const billLines = [];
  if (billTo.address) {
    String(billTo.address)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => billLines.push(l));
  }
  if (billTo.gstin) billLines.push(`GST number: ${billTo.gstin}`);
  if (billTo.stateName) {
    billLines.push(
      `State Name: ${billTo.stateName}${billTo.stateCode ? `, Code: ${billTo.stateCode}` : ""}`,
    );
  }
  if (billTo.cin) billLines.push(`CIN: ${billTo.cin}`);
  if (billTo.email) billLines.push(`E-Mail: ${billTo.email}`);
  if (billTo.phone) billLines.push(`Phone: ${billTo.phone}`);

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("BILL TO", left, y);
  let billY = y + 14;
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827");
  billY += drawWrapped(doc, billTo.name || "—", left, billY, billW) + 4;
  doc.font("Helvetica").fontSize(9).fillColor("#364152");
  for (const line of billLines) {
    billY += drawWrapped(doc, line, left, billY, billW) + 2;
  }

  const metaPad = 10;
  const metaColGap = 10;
  const metaInnerCol = (metaW - metaPad * 2 - metaColGap) / 2;
  const metaLeftX = metaX + metaPad;
  const metaRightX = metaLeftX + metaInnerCol + metaColGap;
  const metaLeftLines = [
    `Invoice No.: ${invoiceNo}`,
    `Invoice Date: ${formatInvoiceDate(invoice.date)}`,
    `Due Date: ${formatInvoiceDate(invoice.dueDate)}`,
  ];
  const metaRightLines = [
    `Place of Supply: ${invoice.placeOfSupply || "Delhi (07)"}`,
    `Account Manager: ${invoice.accountManager || "—"}`,
    `Invoice Duration: ${invoice.invoiceDuration || "—"}`,
  ];
  doc.font("Helvetica").fontSize(8);
  const metaRowGap = 4;
  const metaRowHeights = metaLeftLines.map((leftLine, i) => {
    const leftH = doc.heightOfString(leftLine, { width: metaInnerCol });
    const rightH = doc.heightOfString(metaRightLines[i], { width: metaInnerCol });
    return Math.max(leftH, rightH, 10);
  });
  const metaContentH = metaRowHeights.reduce((sum, h, i) => {
    return sum + h + (i < metaRowHeights.length - 1 ? metaRowGap : 0);
  }, 0);
  const metaH = metaPad * 2 + metaContentH;
  doc.roundedRect(metaX, y, metaW, metaH, 6).fillAndStroke("#f8fafc", "#cfd8e3");
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  let metaY = y + metaPad;
  for (let i = 0; i < metaLeftLines.length; i++) {
    doc.text(metaLeftLines[i], metaLeftX, metaY, { width: metaInnerCol });
    doc.text(metaRightLines[i], metaRightX, metaY, { width: metaInnerCol });
    metaY += metaRowHeights[i] + metaRowGap;
  }

  y = Math.max(billY, y + metaH) + 16;

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
  const totalsH = gst.mode === "cgst_sgst" ? 88 : gst.mode === "igst" ? 74 : 64;
  if (y + totalsH > doc.page.height - 80) {
    doc.addPage();
    y = 36;
  }

  // Amount in words (left) + totals box (right)
  const wordsW = boxX - left - 12;
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#364152")
    .text(`Amount Chargeable (in words): ${amountInWords(grandTotal)}`, left, y + 8, {
      width: wordsW,
    });

  doc.roundedRect(boxX, y, boxW, totalsH, 6).fillAndStroke("#edf4fb", "#d6e6f5");
  let ty = y + 10;
  const row = (label, value, bold = false) => {
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 10 : 9)
      .fillColor(bold ? "#1f4e79" : "#5b6775")
      .text(label, boxX + 12, ty);
    doc
      .font("Helvetica-Bold")
      .fillColor(bold ? "#1f4e79" : "#1f2937")
      .text(value, boxX + 12, ty, { width: boxW - 24, align: "right" });
    ty += 15;
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

  y += totalsH + 16;
  const bankLines = [
    `Beneficiary Name: ${company.bank.beneficiaryName}`,
    `Bank Name: ${company.bank.bankName}`,
    `Branch: ${company.bank.branch}`,
    `Account Type: ${company.bank.accountType}`,
    `Account No.: ${company.bank.accountNo}`,
    `IFSC Code: ${company.bank.ifsc}`,
  ];
  const leftColW = Math.floor(contentWidth * 0.62);
  const signBlockW = contentWidth - leftColW - 14;
  const signX = left + leftColW + 14;
  const bankBoxH = 24 + bankLines.length * 12 + 8;
  const declTextH = doc.heightOfString(company.declaration, { width: leftColW - 20 });
  const notesH = invoice.notes
    ? doc.heightOfString(`Notes: ${invoice.notes}`, { width: leftColW - 20 }) + 8
    : 0;
  const declBoxH = 24 + declTextH + notesH + 12;
  const footerH = bankBoxH + 10 + declBoxH;

  if (y + Math.max(footerH, 130) > doc.page.height - 40) {
    doc.addPage();
    y = 36;
  }

  const footerTop = y;

  // BANK DETAILS — left column
  doc.roundedRect(left, y, leftColW, bankBoxH, 6).fillAndStroke("#f7fbfe", "#d6e6f5");
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("BANK DETAILS", left + 10, y + 10);
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  let by = y + 24;
  for (const line of bankLines) {
    by += drawWrapped(doc, line, left + 10, by, leftColW - 20) + 2;
  }
  y += bankBoxH + 10;

  // DECLARATION — under bank
  doc.roundedRect(left, y, leftColW, declBoxH, 6).fillAndStroke("#f7fbfe", "#d6e6f5");
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1f4e79").text("DECLARATION", left + 10, y + 10);
  doc.font("Helvetica").fontSize(8).fillColor("#364152");
  let dy = y + 24;
  dy += drawWrapped(doc, company.declaration, left + 10, dy, leftColW - 20) + 6;
  if (invoice.notes) {
    drawWrapped(doc, `Notes: ${invoice.notes}`, left + 10, dy, leftColW - 20);
  }

  // Signature — right of bank/declaration
  let sy = footerTop;
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#111827")
    .text("For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED", signX, sy, {
      width: signBlockW,
      align: "right",
    });
  sy += 22;

  if (fs.existsSync(signPath)) {
    try {
      const imgW = Math.min(170, signBlockW);
      doc.image(signPath, signX + signBlockW - imgW, sy, {
        width: imgW,
        height: 52,
        fit: [imgW, 52],
      });
      sy += 58;
    } catch {
      sy += 16;
    }
  } else {
    sy += 16;
  }

  doc
    .moveTo(signX + 20, sy)
    .lineTo(right, sy)
    .strokeColor("#cfd8e3")
    .lineWidth(0.8)
    .stroke();
  sy += 8;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text("Authorised Signatory", signX, sy, { width: signBlockW, align: "right" });
  sy += 14;

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#7b8796")
    .text(formatInvoiceDate(invoice.date), signX, sy, { width: signBlockW, align: "right" });

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
