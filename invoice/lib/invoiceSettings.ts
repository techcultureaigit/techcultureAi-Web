export type InvoiceMailSettings = {
  id: "default";
  autoEmailEnabled: boolean;
  reminderIntervalDays: number;
  overdueAfterDays: number;
  businessName: string;
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
  overdueAfterDays: 5,
  businessName: "TechCulture Technologies",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  smtpFromEmail: "",
  smtpFromName: "TechCulture Technologies",
  smtpPassConfigured: false,
};

export function normalizeInvoiceMailSettings(
  input?: Partial<InvoiceMailSettings> | null,
): InvoiceMailSettings {
  return {
    id: "default",
    autoEmailEnabled:
      input?.autoEmailEnabled == null
        ? DEFAULT_INVOICE_MAIL_SETTINGS.autoEmailEnabled
        : Boolean(input.autoEmailEnabled),
    reminderIntervalDays: Math.max(
      1,
      Math.min(
        30,
        Number(input?.reminderIntervalDays) ||
          DEFAULT_INVOICE_MAIL_SETTINGS.reminderIntervalDays,
      ),
    ),
    overdueAfterDays: Math.max(
      1,
      Math.min(
        90,
        Number(input?.overdueAfterDays) || DEFAULT_INVOICE_MAIL_SETTINGS.overdueAfterDays,
      ),
    ),
    businessName:
      String(input?.businessName || "").trim() ||
      DEFAULT_INVOICE_MAIL_SETTINGS.businessName,
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

export function daysBetween(fromIso: string | null | undefined, to = new Date()) {
  if (!fromIso) return Infinity;
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) return Infinity;
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}
