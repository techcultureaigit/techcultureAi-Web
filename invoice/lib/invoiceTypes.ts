export type InvoiceLineItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
};

export type CommissionRow = {
  id: string;
  month: string;
  users: number;
  ratePerUser: number;
  commissionPercent: number;
};

export type InvoiceParty = {
  name: string;
  address: string;
  gstin?: string;
  stateName?: string;
  stateCode?: string;
  cin?: string;
  email?: string;
  phone?: string;
};

export type InvoiceDocument = {
  id: string;
  invoiceNo: string;
  name: string;
  email?: string;
  phone?: string;
  amount?: number;
  status?: string;
  date?: string;
  category?: string;
  description?: string;
  billTo: InvoiceParty;
  lineItems: InvoiceLineItem[];
  commissionRows: CommissionRow[];
  gstApplicable: boolean;
  gstPercent: number;
  gstNote: string;
  notes?: string;
  firstSentAt?: string | null;
  lastReminderAt?: string | null;
  paidEmailSentAt?: string | null;
  paymentProofUrl?: string | null;
  paymentProofName?: string | null;
  kind: "invoice";
};

export type InvoiceRecord = InvoiceDocument & Record<string, unknown>;
