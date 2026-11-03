import { invoiceCollection, toAppDoc } from "../db.js";
import {
  defaultInvoiceSettings,
  publicInvoiceSettings,
  shapeInvoiceSettings,
} from "../schemas.js";

function col() {
  return invoiceCollection("settings");
}

export async function getSettings(_req, res) {
  try {
    const doc = await col().findOne({ id: "default" });
    const raw = doc ? toAppDoc(doc) : defaultInvoiceSettings();
    // Prefill from env if DB fields empty (first-time setup)
    const withEnv = {
      ...raw,
      smtpUser: raw.smtpUser || process.env.SMTP_USER || "",
      smtpFromEmail:
        raw.smtpFromEmail || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "",
      smtpFromName:
        raw.smtpFromName ||
        process.env.SMTP_FROM_NAME ||
        raw.businessName ||
        "TechCulture Technologies",
      businessName:
        raw.businessName ||
        process.env.SMTP_FROM_NAME ||
        "TechCulture Technologies",
      smtpHost: raw.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: raw.smtpPort || Number(process.env.SMTP_PORT || 587),
      smtpPass: raw.smtpPass || process.env.SMTP_PASS || "",
    };
    return res.json({ success: true, settings: publicInvoiceSettings(withEnv) });
  } catch (err) {
    console.error("[invoice] getSettings", err);
    return res.status(500).json({ success: false, message: "Failed to load settings" });
  }
}

export async function updateSettings(req, res) {
  try {
    const existing = await col().findOne({ id: "default" });
    const existingPass = existing?.smtpPass || process.env.SMTP_PASS || "";
    const body = { ...(req.body || {}) };

    // Empty password in UI means "keep existing"
    if (!String(body.smtpPass || "").trim()) {
      delete body.smtpPass;
    }

    const settings = shapeInvoiceSettings(
      { ...existing, ...body, id: "default" },
      { keepPass: existingPass },
    );
    const now = new Date().toISOString();
    const doc = {
      ...settings,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (existing) {
      await col().replaceOne({ _id: existing._id }, { ...doc, _id: existing._id });
    } else {
      await col().insertOne(doc);
    }

    return res.json({ success: true, settings: publicInvoiceSettings(doc) });
  } catch (err) {
    console.error("[invoice] updateSettings", err);
    return res.status(500).json({ success: false, message: "Failed to save settings" });
  }
}

export async function loadMailSettingsFromDb() {
  const doc = await col().findOne({ id: "default" });
  const raw = doc ? toAppDoc(doc) : {};
  return shapeInvoiceSettings(
    {
      ...defaultInvoiceSettings(),
      ...raw,
      smtpUser: raw.smtpUser || process.env.SMTP_USER || "",
      smtpPass: raw.smtpPass || process.env.SMTP_PASS || "",
      smtpFromEmail:
        raw.smtpFromEmail || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "",
      smtpFromName:
        raw.smtpFromName || process.env.SMTP_FROM_NAME || "TechCulture Technologies",
      smtpHost: raw.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: raw.smtpPort || Number(process.env.SMTP_PORT || 587),
    },
    { keepPass: raw.smtpPass || process.env.SMTP_PASS || "" },
  );
}
