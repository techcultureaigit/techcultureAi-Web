import { COMPANY_PROFILE } from "@/lib/companyDefaults";
import type {
  CommissionRow,
  InvoiceDocument,
  InvoiceLineItem,
  InvoiceParty,
} from "@/lib/invoiceTypes";

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyLineItem(): InvoiceLineItem {
  return { id: uid("line"), description: "", qty: 1, rate: 0, hsnSac: "" };
}

export function addDaysToIsoDate(dateStr: string | undefined, days: number) {
  const base = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(base.getTime())) return "";
  base.setDate(base.getDate() + Number(days || 0));
  return base.toISOString().slice(0, 10);
}

export function invoiceDurationLabel(dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
}

export type GstBreakdown = {
  mode: "none" | "cgst_sgst" | "igst";
  gstPercent: number;
  halfPercent: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
};

function normalizeStateCode(raw?: string | null) {
  const text = String(raw || "").trim();
  if (!text) return "";
  const fromParens = text.match(/\((\d{1,2})\)/);
  if (fromParens) return fromParens[1].padStart(2, "0");
  if (/^\d{1,2}$/.test(text)) return text.padStart(2, "0");
  // GSTIN starts with 2-digit state code
  if (/^\d{2}[A-Z]/.test(text.toUpperCase())) return text.slice(0, 2);
  return "";
}

/**
 * Same-state buyer/seller → CGST + SGST.
 * Different states → IGST.
 * Seller defaults to company Delhi (07).
 */
export function resolveGstBreakdown(input: {
  subTotal: number;
  gstApplicable: boolean;
  gstPercent: number;
  buyerStateCode?: string | null;
  buyerGstin?: string | null;
  placeOfSupply?: string | null;
  sellerStateCode?: string | null;
}): GstBreakdown {
  const gstPercent = Number(input.gstPercent || 0);
  const empty: GstBreakdown = {
    mode: "none",
    gstPercent,
    halfPercent: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalGst: 0,
  };
  if (!input.gstApplicable || gstPercent <= 0) return empty;

  const sellerCode = normalizeStateCode(
    input.sellerStateCode || COMPANY_PROFILE.stateCode || "07",
  );
  const buyerCode =
    normalizeStateCode(input.buyerStateCode) ||
    normalizeStateCode(input.placeOfSupply) ||
    normalizeStateCode(input.buyerGstin);

  const totalGst = calcGstAmount(input.subTotal, true, gstPercent);
  const sameState = Boolean(sellerCode && buyerCode && sellerCode === buyerCode);

  // If buyer state unknown, default to CGST+SGST (seller Delhi + common local billing)
  if (!buyerCode || sameState) {
    const halfPercent = gstPercent / 2;
    const half = calcGstAmount(input.subTotal, true, halfPercent);
    return {
      mode: "cgst_sgst",
      gstPercent,
      halfPercent,
      cgst: half,
      sgst: half,
      igst: 0,
      totalGst,
    };
  }

  return {
    mode: "igst",
    gstPercent,
    halfPercent: 0,
    cgst: 0,
    sgst: 0,
    igst: totalGst,
    totalGst,
  };
}

/** @deprecated Prefer resolveGstBreakdown */
export function calcCgstSgst(
  subTotal: number,
  gstApplicable: boolean,
  gstPercent: number,
) {
  const b = resolveGstBreakdown({ subTotal, gstApplicable, gstPercent });
  return { halfPercent: b.halfPercent, cgst: b.cgst, sgst: b.sgst };
}

export function emptyCommissionRow(): CommissionRow {
  return {
    id: uid("comm"),
    month: "",
    users: 0,
    ratePerUser: 0,
    commissionPercent: 15,
  };
}

export function emptyParty(): InvoiceParty {
  return {
    name: "",
    address: "",
    gstin: "",
    stateName: "",
    stateCode: "",
    cin: "",
    email: "",
    phone: "",
  };
}

export function lineAmount(item: InvoiceLineItem) {
  return Number(item.qty || 0) * Number(item.rate || 0);
}

export function commissionUserAmount(row: CommissionRow) {
  return Number(row.users || 0) * Number(row.ratePerUser || 0);
}

export function commissionPartnerAmount(row: CommissionRow) {
  return (commissionUserAmount(row) * Number(row.commissionPercent || 0)) / 100;
}

export function calcSubTotal(items: InvoiceLineItem[]) {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

export function calcGstAmount(subTotal: number, gstApplicable: boolean, gstPercent: number) {
  if (!gstApplicable) return 0;
  return (subTotal * Number(gstPercent || 0)) / 100;
}

export function calcGrandTotal(
  items: InvoiceLineItem[],
  gstApplicable: boolean,
  gstPercent: number,
) {
  const subTotal = calcSubTotal(items);
  return subTotal + calcGstAmount(subTotal, gstApplicable, gstPercent);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

export function formatInvoiceDate(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
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

function twoDigits(n: number) {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return `${TENS[ten]}${one ? ` ${ONES[one]}` : ""}`.trim();
}

function threeDigits(n: number) {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (hundred && rest) return `${ONES[hundred]} Hundred ${twoDigits(rest)}`;
  if (hundred) return `${ONES[hundred]} Hundred`;
  return twoDigits(rest);
}

export function amountInWords(amount: number) {
  const value = Math.round(Number(amount || 0));
  if (value === 0) return "Rupees Zero Only";

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = value % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return `Rupees ${parts.join(" ")} Only`;
}

export function nextInvoiceNo(existing: Array<{ invoiceNo?: string; id?: string }>) {
  const year = new Date().getFullYear();
  let max = 0;
  for (const item of existing) {
    const raw = String(item.invoiceNo || item.id || "");
    const match = raw.match(/(\d+)\s*\/\s*(\d{4})/);
    if (match && Number(match[2]) === year) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return `${String(max + 1).padStart(3, "0")}/${year}`;
}

export function createBlankInvoice(existing: Array<{ invoiceNo?: string; id?: string }> = []): InvoiceDocument {
  const invoiceNo = nextInvoiceNo(existing);
  const date = new Date().toISOString().slice(0, 10);
  return {
    id: `INV-${Date.now().toString().slice(-6)}`,
    invoiceNo,
    name: "",
    email: "",
    phone: "",
    amount: 0,
    status: "Pending",
    date,
    dueDate: addDaysToIsoDate(date, 15),
    placeOfSupply: "Delhi (07)",
    accountManager: "",
    invoiceDuration: invoiceDurationLabel(date),
    category: "",
    description: "",
    billTo: emptyParty(),
    lineItems: [
      { ...emptyLineItem(), description: "One-time Implementation Charges", qty: 1, rate: 0 },
    ],
    commissionRows: [],
    gstApplicable: false,
    gstPercent: 0,
    gstNote: "Not Applicable",
    notes: "",
    firstSentAt: null,
    lastReminderAt: null,
    paidEmailSentAt: null,
    paymentProofUrl: null,
    paymentProofName: null,
    kind: "invoice",
  };
}

export function normalizeInvoice(input: Partial<InvoiceDocument> & { id: string }): InvoiceDocument {
  const base = createBlankInvoice();
  const lineItems =
    input.lineItems && input.lineItems.length > 0
      ? input.lineItems.map((item) => ({
          id: item.id || uid("line"),
          description: item.description || "",
          qty: Number(item.qty || 0),
          rate: Number(item.rate || 0),
          hsnSac: item.hsnSac || "",
        }))
      : base.lineItems;

  const commissionRows = (input.commissionRows || []).map((row) => ({
    id: row.id || uid("comm"),
    month: row.month || "",
    users: Number(row.users || 0),
    ratePerUser: Number(row.ratePerUser || 0),
    commissionPercent: Number(row.commissionPercent || 0),
  }));

  const billTo = { ...emptyParty(), ...(input.billTo || {}) };
  if (!billTo.name && input.name) billTo.name = input.name;
  if (!billTo.email && input.email) billTo.email = input.email;
  if (!billTo.phone && input.phone) billTo.phone = input.phone;

  const gstApplicable = Boolean(input.gstApplicable);
  const gstPercent = Number(input.gstPercent || 0);
  const amount = calcGrandTotal(lineItems, gstApplicable, gstPercent);

  return {
    ...base,
    ...input,
    id: input.id,
    invoiceNo: input.invoiceNo || input.id,
    name: billTo.name || input.name || "",
    email: billTo.email || input.email || "",
    phone: billTo.phone || input.phone || "",
    amount,
    status: input.status || "Pending",
    date: input.date || base.date,
    dueDate: input.dueDate || addDaysToIsoDate(input.date || base.date, 15),
    placeOfSupply:
      input.placeOfSupply ||
      (billTo.stateName
        ? `${billTo.stateName}${billTo.stateCode ? ` (${billTo.stateCode})` : ""}`
        : base.placeOfSupply),
    accountManager: input.accountManager || "",
    invoiceDuration: input.invoiceDuration || invoiceDurationLabel(input.date || base.date),
    billTo,
    lineItems,
    commissionRows,
    gstApplicable,
    gstPercent,
    gstNote: input.gstNote || (gstApplicable ? `${gstPercent}%` : "Not Applicable"),
    notes: input.notes || input.description || "",
    description: input.notes || input.description || "",
    firstSentAt: input.firstSentAt ?? null,
    lastReminderAt: input.lastReminderAt ?? null,
    paidEmailSentAt: input.paidEmailSentAt ?? null,
    paymentProofUrl: input.paymentProofUrl ?? null,
    paymentProofName: input.paymentProofName ?? null,
    kind: "invoice",
  };
}

export function companyFromDefaults(
  settings?: {
    businessAddress?: string;
    businessCin?: string;
    businessLegalName?: string;
  } | null,
) {
  const address = String(settings?.businessAddress || "").trim();
  const legalName = String(settings?.businessLegalName || "").trim();
  const cin = String(settings?.businessCin || "").trim();
  return {
    ...COMPANY_PROFILE,
    address: address || COMPANY_PROFILE.address,
    legalName: legalName || COMPANY_PROFILE.legalName,
    cin: cin || COMPANY_PROFILE.cin,
  };
}
