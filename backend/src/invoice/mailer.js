import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "assets");

function env(name, fallback = "") {
  const value = process.env[name]?.trim();
  return value || fallback;
}

/**
 * Resolve SMTP config from DB settings first, then .env fallback.
 * @param {object} [overrides]
 */
export function getMailConfig(overrides = {}) {
  const user = String(overrides.smtpUser || env("SMTP_USER")).trim().toLowerCase();
  const pass = String(overrides.smtpPass || env("SMTP_PASS")).replace(/\s+/g, "");
  const fromEmail = String(
    overrides.smtpFromEmail || env("SMTP_FROM_EMAIL") || user,
  )
    .trim()
    .toLowerCase();
  const fromName = String(
    overrides.smtpFromName ||
      overrides.businessName ||
      env("SMTP_FROM_NAME") ||
      "TechCulture Technologies",
  ).trim();

  if (!user) {
    throw new Error(
      "SMTP user is missing. Set it in Settings → Email sender, or in backend/.env SMTP_USER",
    );
  }
  if (!pass) {
    throw new Error(
      "SMTP password is missing. Set Gmail App Password in Settings → Email sender, or in backend/.env SMTP_PASS",
    );
  }
  if (!fromEmail) {
    throw new Error(
      "Sender email is missing. Set SMTP From Email in Settings → Email sender",
    );
  }

  return {
    host: String(overrides.smtpHost || env("SMTP_HOST", "smtp.gmail.com")).trim(),
    port: Number(overrides.smtpPort || env("SMTP_PORT", "587") || 587),
    user,
    pass,
    fromName,
    fromEmail,
  };
}

export function createTransport(overrides = {}) {
  const config = getMailConfig(overrides);
  return {
    config,
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    }),
  };
}

export function getInvoiceMailAttachments() {
  const logoPath = path.join(ASSETS_DIR, "techculture-logo.png");
  const signPath = path.join(ASSETS_DIR, "authorised-signatory.png");
  const attachments = [];

  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: "techculture-logo.png",
      path: logoPath,
      cid: "tc-logo@invoice",
    });
  }
  if (fs.existsSync(signPath)) {
    attachments.push({
      filename: "authorised-signatory.png",
      path: signPath,
      cid: "tc-sign@invoice",
    });
  }
  return attachments;
}
