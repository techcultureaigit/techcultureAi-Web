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
  return { id: uid("line"), description: "", qty: 1, rate: 0 };
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

export function companyFromDefaults() {
  return COMPANY_PROFILE;
}
