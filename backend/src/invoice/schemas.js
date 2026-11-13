import { newId } from "./db.js";
import { COMPANY_PROFILE } from "./companyDefaults.js";

function str(v, fallback = "") {
  return v == null ? fallback : String(v).trim();
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function bool(v, fallback = false) {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "yes" || v === 1) return true;
  if (v === "false" || v === "no" || v === 0) return false;
  return fallback;
}

export function emptyAddress() {
  return {
    attention: "",
    country: "India",
    street1: "",
    street2: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    fax: "",
  };
}

export function shapeAddress(input = {}) {
  const base = emptyAddress();
  return {
    attention: str(input.attention, base.attention),
    country: str(input.country, base.country),
    street1: str(input.street1, base.street1),
    street2: str(input.street2, base.street2),
    city: str(input.city, base.city),
    state: str(input.state, base.state),
    pinCode: str(input.pinCode, base.pinCode),
    phone: str(input.phone, base.phone),
    fax: str(input.fax, base.fax),
  };
}

export function shapeContactPerson(input = {}) {
  return {
    id: str(input.id) || newId("cp"),
    salutation: str(input.salutation),
    firstName: str(input.firstName),
    lastName: str(input.lastName),
    email: str(input.email).toLowerCase(),
    workPhone: str(input.workPhone),
    mobile: str(input.mobile),
  };
}

export function shapeCustomer(input = {}, { keepId } = {}) {
  const id = keepId || str(input.id) || newId("CUS");
  const billingAddress = shapeAddress(input.billingAddress);
  const shippingAddress = input.sameAsBilling
    ? { ...billingAddress }
    : shapeAddress(input.shippingAddress);

  const companyName = str(input.companyName);
  const firstName = str(input.firstName);
  const lastName = str(input.lastName);
  const displayName = str(input.displayName);
  const name =
    str(input.name) ||
    companyName ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    displayName ||
    "Customer";

  return {
    id,
    _id: id,
    name,
    email: str(input.email).toLowerCase(),
    phone: str(input.phone) || str(input.mobile) || str(input.workPhone),
    date: str(input.date) || new Date().toISOString().slice(0, 10),
    status: str(input.status, "Active"),
    customerType: input.customerType === "Individual" ? "Individual" : "Business",
    salutation: str(input.salutation),
    firstName,
    lastName,
    companyName,
    displayName: displayName || name,
    currency: str(input.currency, "INR - Indian Rupee"),
    workPhone: str(input.workPhone),
    mobile: str(input.mobile),
    gstNumber: str(input.gstNumber || input.gstTreatment).toUpperCase(),
    gstTreatment: str(input.gstNumber || input.gstTreatment).toUpperCase(),
    placeOfSupply: str(input.placeOfSupply),
    pan: str(input.pan).toUpperCase(),
    paymentTerms: str(input.paymentTerms, "Due on Receipt"),
    priceList: str(input.priceList),
    enablePortal: bool(input.enablePortal, false),
    portalLanguage: str(input.portalLanguage, "English"),
    documents: Array.isArray(input.documents)
      ? input.documents.map((d) => ({
          id: str(d.id) || newId("doc"),
          name: str(d.name),
          size: num(d.size),
          type: str(d.type),
        }))
      : [],
    billingAddress,
    shippingAddress,
    sameAsBilling: bool(input.sameAsBilling, true),
    contactPersons: Array.isArray(input.contactPersons)
      ? input.contactPersons.map(shapeContactPerson)
      : [],
    kind: "customer",
  };
}

export function shapeLineItem(input = {}) {
  return {
    id: str(input.id) || newId("line"),
    description: str(input.description),
    qty: num(input.qty, 1),
    rate: num(input.rate),
    hsnSac: str(input.hsnSac),
  };
}

export function shapeCommissionRow(input = {}) {
  return {
    id: str(input.id) || newId("comm"),
    month: str(input.month),
    users: num(input.users),
    ratePerUser: num(input.ratePerUser),
    commissionPercent: num(input.commissionPercent, 15),
  };
}

export function shapeBillTo(input = {}, fallback = {}) {
  return {
    name: str(input.name) || str(fallback.name),
    address: str(input.address),
    gstin: str(input.gstin),
    stateName: str(input.stateName),
    stateCode: str(input.stateCode),
    cin: str(input.cin),
    email: str(input.email || fallback.email).toLowerCase(),
    phone: str(input.phone || fallback.phone),
  };
}

export function calcLineTotal(item) {
  return num(item.qty) * num(item.rate);
}

export function calcInvoiceAmount(lineItems, gstApplicable, gstPercent) {
  const sub = (lineItems || []).reduce((sum, item) => sum + calcLineTotal(item), 0);
  if (!gstApplicable) return Math.round(sub * 100) / 100;
  const gst = (sub * num(gstPercent)) / 100;
  return Math.round((sub + gst) * 100) / 100;
}

export function shapeInvoice(input = {}, { keepId } = {}) {
  const id = keepId || str(input.id) || newId("INV");
  const lineItems = Array.isArray(input.lineItems)
    ? input.lineItems.map(shapeLineItem)
    : [{ id: newId("line"), description: "", qty: 1, rate: 0 }];
  const gstApplicable = bool(input.gstApplicable, false);
  const gstPercent = num(input.gstPercent, gstApplicable ? 18 : 0);
  const billTo = shapeBillTo(input.billTo, input);
  const amount =
    input.amount != null && input.amount !== ""
      ? num(input.amount)
      : calcInvoiceAmount(lineItems, gstApplicable, gstPercent);

  return {
    id,
    _id: id,
    invoiceNo: str(input.invoiceNo) || id,
    name: billTo.name || str(input.name),
    email: billTo.email || str(input.email).toLowerCase(),
    phone: billTo.phone || str(input.phone),
    amount,
    status: str(input.status, "Pending"),
    date: str(input.date) || new Date().toISOString().slice(0, 10),
    dueDate: str(input.dueDate),
    placeOfSupply: str(input.placeOfSupply, "Delhi (07)"),
    accountManager: str(input.accountManager),
    invoiceDuration: str(input.invoiceDuration),
    category: str(input.category),
    description: str(input.description || input.notes),
    notes: str(input.notes || input.description),
    billTo,
    lineItems,
    commissionRows: Array.isArray(input.commissionRows)
      ? input.commissionRows.map(shapeCommissionRow)
      : [],
    gstApplicable,
    gstPercent,
    gstNote: str(input.gstNote, gstApplicable ? `${gstPercent}%` : "Not Applicable"),
    // Email / payment workflow tracking
    firstSentAt: str(input.firstSentAt) || null,
    lastReminderAt: str(input.lastReminderAt) || null,
    paidEmailSentAt: str(input.paidEmailSentAt) || null,
    paymentProofUrl: str(input.paymentProofUrl) || null,
    paymentProofName: str(input.paymentProofName) || null,
    kind: "invoice",
  };
}

function normalizeIntervalUnit(raw, fallback = "days") {
  const unit = String(raw || fallback || "days").toLowerCase();
  if (unit === "minutes" || unit === "minute" || unit === "min") return "minutes";
  if (unit === "hours" || unit === "hour" || unit === "hr") return "hours";
  return "days";
}

function clampInterval(value, unit, fallback) {
  const n = Math.max(1, Math.floor(num(value, fallback) || fallback || 1));
  if (unit === "minutes") return Math.min(n, 24 * 60);
  if (unit === "hours") return Math.min(n, 24 * 30);
  return Math.min(n, 90);
}

export function defaultInvoiceSettings() {
  return {
    id: "default",
    _id: "default",
    autoEmailEnabled: true,
    reminderIntervalDays: 2,
    reminderInterval: 2,
    reminderIntervalUnit: "days",
    overdueAfterDays: 5,
    overdueAfter: 5,
    overdueAfterUnit: "days",
    businessName: "TechCulture Technologies",
    businessAddress: COMPANY_PROFILE.address,
    businessCin: COMPANY_PROFILE.cin,
    businessLegalName: COMPANY_PROFILE.legalName,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpFromEmail: "",
    smtpFromName: "TechCulture Technologies",
    ccEmails: [],
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeCcEmails(input) {
  const list = Array.isArray(input)
    ? input
    : String(input ?? "")
        .split(/[,;\n]+/)
        .map((part) => part.trim());
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const email = String(raw || "")
      .trim()
      .toLowerCase();
    if (!email || !EMAIL_RE.test(email) || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}

export function shapeInvoiceSettings(input = {}, { keepPass } = {}) {
  const base = defaultInvoiceSettings();
  const reminderUnit = normalizeIntervalUnit(
    input.reminderIntervalUnit,
    base.reminderIntervalUnit,
  );
  const overdueUnit = normalizeIntervalUnit(input.overdueAfterUnit, base.overdueAfterUnit);
  const reminder = clampInterval(
    input.reminderInterval ?? input.reminderIntervalDays,
    reminderUnit,
    base.reminderInterval,
  );
  const overdue = clampInterval(
    input.overdueAfter ?? input.overdueAfterDays,
    overdueUnit,
    base.overdueAfter,
  );
  const incomingPass = str(input.smtpPass);
  const smtpPass =
    incomingPass ||
    (keepPass != null ? str(keepPass) : str(input.smtpPass, base.smtpPass));

  return {
    id: "default",
    _id: "default",
    autoEmailEnabled: bool(input.autoEmailEnabled, base.autoEmailEnabled),
    reminderInterval: reminder,
    reminderIntervalUnit: reminderUnit,
    reminderIntervalDays: reminderUnit === "days" ? reminder : base.reminderIntervalDays,
    overdueAfter: overdue,
    overdueAfterUnit: overdueUnit,
    overdueAfterDays: overdueUnit === "days" ? overdue : base.overdueAfterDays,
    businessName: str(input.businessName, base.businessName),
    businessAddress: str(input.businessAddress, base.businessAddress) || base.businessAddress,
    businessCin: str(input.businessCin, base.businessCin) || base.businessCin,
    businessLegalName:
      str(input.businessLegalName, base.businessLegalName) || base.businessLegalName,
    smtpHost: str(input.smtpHost, base.smtpHost) || base.smtpHost,
    smtpPort: Math.max(1, num(input.smtpPort, base.smtpPort) || base.smtpPort),
    smtpUser: str(input.smtpUser).toLowerCase(),
    smtpPass,
    smtpFromEmail: str(input.smtpFromEmail || input.smtpUser).toLowerCase(),
    smtpFromName: str(input.smtpFromName || input.businessName, base.smtpFromName),
    ccEmails: normalizeCcEmails(input.ccEmails),
  };
}

/** Safe settings payload for API responses — never expose raw SMTP password */
export function publicInvoiceSettings(settings = {}) {
  const shaped = shapeInvoiceSettings(settings);
  return {
    ...shaped,
    smtpPass: "",
    smtpPassConfigured: Boolean(str(settings.smtpPass || shaped.smtpPass)),
  };
}

export function shapePayment(input = {}, { keepId } = {}) {
  const id = keepId || str(input.id) || newId("PAY");
  return {
    id,
    _id: id,
    name: str(input.name),
    email: str(input.email).toLowerCase(),
    phone: str(input.phone),
    amount: num(input.amount),
    status: str(input.status, "Completed"),
    date: str(input.date) || new Date().toISOString().slice(0, 10),
    category: str(input.category),
    description: str(input.description),
    invoiceId: str(input.invoiceId),
    kind: "payment",
  };
}

export function validateCustomer(body) {
  const customer = shapeCustomer(body);
  if (!customer.name) return { ok: false, message: "Customer name is required" };
  return { ok: true, data: customer };
}

export function validateInvoice(body) {
  const invoice = shapeInvoice(body);
  if (!invoice.billTo.name) {
    return { ok: false, message: "Bill To / customer name is required" };
  }
  if (!invoice.lineItems.some((item) => item.description)) {
    return { ok: false, message: "At least one line item description is required" };
  }
  return { ok: true, data: invoice };
}

export function validatePayment(body) {
  const payment = shapePayment(body);
  if (!payment.name) return { ok: false, message: "Payment customer name is required" };
  if (payment.amount < 0) return { ok: false, message: "Amount must be >= 0" };
  return { ok: true, data: payment };
}

/** Invoices received from others — saved by admin as proof */
export function shapeReceivedInvoice(input = {}, { keepId } = {}) {
  const id = keepId || str(input.id) || newId("RCV");
  return {
    id,
    _id: id,
    name: str(input.name || input.senderName),
    amount: num(input.amount),
    date: str(input.date) || new Date().toISOString().slice(0, 10),
    status: str(input.status, "Received"),
    description: str(input.description || input.notes),
    proofUrl: str(input.proofUrl) || null,
    proofName: str(input.proofName) || null,
    kind: "received_invoice",
  };
}

export function validateReceivedInvoice(body) {
  const doc = shapeReceivedInvoice(body);
  if (!doc.name) {
    return { ok: false, message: "Sender / invoice name is required" };
  }
  if (doc.amount < 0) {
    return { ok: false, message: "Amount must be >= 0" };
  }
  if (!doc.proofUrl) {
    return { ok: false, message: "Invoice proof file is required" };
  }
  return { ok: true, data: doc };
}
