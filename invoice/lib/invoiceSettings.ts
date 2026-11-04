import { COMPANY_PROFILE } from "@/lib/companyDefaults";

export type IntervalUnit = "minutes" | "hours" | "days";

export type InvoiceMailSettings = {
  id: "default";
  autoEmailEnabled: boolean;
  /** @deprecated Prefer reminderInterval + reminderIntervalUnit */
  reminderIntervalDays: number;
  reminderInterval: number;
  reminderIntervalUnit: IntervalUnit;
  /** @deprecated Prefer overdueAfter + overdueAfterUnit */
  overdueAfterDays: number;
  overdueAfter: number;
  overdueAfterUnit: IntervalUnit;
  businessName: string;
  businessAddress: string;
  businessCin: string;
  businessLegalName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFromEmail: string;
  smtpFromName: string;
  smtpPassConfigured?: boolean;
};

export const DEFAULT_INVOICE_MAIL_SETTINGS: InvoiceMailSettings = {
  id: "default",
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
  smtpPassConfigured: false,
};

function clampInterval(value: number, unit: IntervalUnit) {
  const n = Math.max(1, Math.floor(Number(value) || 1));
  if (unit === "minutes") return Math.min(n, 24 * 60);
  if (unit === "hours") return Math.min(n, 24 * 30);
  return Math.min(n, 90);
}

export function normalizeIntervalUnit(raw: unknown): IntervalUnit {
  const unit = String(raw || "").toLowerCase();
  if (unit === "minutes" || unit === "minute" || unit === "min") return "minutes";
  if (unit === "hours" || unit === "hour" || unit === "hr") return "hours";
  return "days";
}

export function intervalToMs(value: number, unit: IntervalUnit) {
  const n = Math.max(1, Number(value) || 1);
  if (unit === "minutes") return n * 60 * 1000;
  if (unit === "hours") return n * 60 * 60 * 1000;
  return n * 24 * 60 * 60 * 1000;
}

export function elapsedMs(fromIso: string | null | undefined, to = new Date()) {
  if (!fromIso) return Number.POSITIVE_INFINITY;
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) return Number.POSITIVE_INFINITY;
  return Math.max(0, to.getTime() - from.getTime());
}

export function formatIntervalLabel(value: number, unit: IntervalUnit) {
  const n = Math.max(1, Number(value) || 1);
  if (unit === "minutes") return `${n} min`;
  if (unit === "hours") return `${n} hour${n === 1 ? "" : "s"}`;
  return `${n} day${n === 1 ? "" : "s"}`;
}

/** Calendar days to add for invoice Due Date from automation settings. */
export function dueDaysFromSettings(
  settings?: Partial<InvoiceMailSettings> | null,
) {
  const unit = normalizeIntervalUnit(settings?.overdueAfterUnit ?? "days");
  const value = Math.max(
    1,
    Number(
      settings?.overdueAfter ??
        settings?.overdueAfterDays ??
        DEFAULT_INVOICE_MAIL_SETTINGS.overdueAfter,
    ) || DEFAULT_INVOICE_MAIL_SETTINGS.overdueAfter,
  );
  if (unit === "days") return Math.min(90, value);
  if (unit === "hours") return Math.min(90, Math.max(1, Math.ceil(value / 24)));
  return Math.min(90, Math.max(1, Math.ceil(value / (24 * 60))));
}

export function normalizeInvoiceMailSettings(
  input?: Partial<InvoiceMailSettings> | null,
): InvoiceMailSettings {
  const reminderUnit = normalizeIntervalUnit(
    input?.reminderIntervalUnit ?? "days",
  );
  const overdueUnit = normalizeIntervalUnit(input?.overdueAfterUnit ?? "days");
  const reminderInterval = clampInterval(
    Number(
      input?.reminderInterval ??
        input?.reminderIntervalDays ??
        DEFAULT_INVOICE_MAIL_SETTINGS.reminderInterval,
    ),
    reminderUnit,
  );
  const overdueAfter = clampInterval(
    Number(
      input?.overdueAfter ??
        input?.overdueAfterDays ??
        DEFAULT_INVOICE_MAIL_SETTINGS.overdueAfter,
    ),
    overdueUnit,
  );

  return {
    id: "default",
    autoEmailEnabled:
      input?.autoEmailEnabled == null
        ? DEFAULT_INVOICE_MAIL_SETTINGS.autoEmailEnabled
        : Boolean(input.autoEmailEnabled),
    reminderInterval,
    reminderIntervalUnit: reminderUnit,
    reminderIntervalDays:
      reminderUnit === "days"
        ? reminderInterval
        : DEFAULT_INVOICE_MAIL_SETTINGS.reminderIntervalDays,
    overdueAfter,
    overdueAfterUnit: overdueUnit,
    overdueAfterDays:
      overdueUnit === "days"
        ? overdueAfter
        : DEFAULT_INVOICE_MAIL_SETTINGS.overdueAfterDays,
    businessName:
      String(input?.businessName || "").trim() ||
      DEFAULT_INVOICE_MAIL_SETTINGS.businessName,
    businessAddress:
      String(input?.businessAddress || "").trim() ||
      DEFAULT_INVOICE_MAIL_SETTINGS.businessAddress,
    businessCin:
      String(input?.businessCin || "").trim() || DEFAULT_INVOICE_MAIL_SETTINGS.businessCin,
    businessLegalName:
      String(input?.businessLegalName || "").trim() ||
      DEFAULT_INVOICE_MAIL_SETTINGS.businessLegalName,
    smtpHost:
      String(input?.smtpHost || "").trim() || DEFAULT_INVOICE_MAIL_SETTINGS.smtpHost,
    smtpPort: Number(input?.smtpPort) || DEFAULT_INVOICE_MAIL_SETTINGS.smtpPort,
    smtpUser: String(input?.smtpUser || "").trim().toLowerCase(),
    smtpPass: String(input?.smtpPass || ""),
    smtpFromEmail: String(input?.smtpFromEmail || "").trim().toLowerCase(),
    smtpFromName:
      String(input?.smtpFromName || "").trim() ||
      DEFAULT_INVOICE_MAIL_SETTINGS.smtpFromName,
    smtpPassConfigured: Boolean(input?.smtpPassConfigured),
  };
}

/** @deprecated Use elapsedMs + intervalToMs for minute/hour support */
export function daysBetween(fromIso: string | null | undefined, to = new Date()) {
  if (!fromIso) return Infinity;
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) return Infinity;
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}
