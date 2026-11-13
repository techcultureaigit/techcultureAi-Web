import { config as rootConfig } from "../config.js";

/**
 * Invoice app config — kept separate from backoffice / AI-user settings.
 * Uses the same Mongo URI by default, with invoice_* collections.
 */
export const invoiceConfig = {
  /** Prefixed collections so they never collide with backoffice data */
  collections: {
    customers: "invoice_customers",
    invoices: "invoice_invoices",
    payments: "invoice_payments",
    receivedInvoices: "invoice_received_invoices",
    settings: "invoice_settings",
  },
  corsOrigins: rootConfig.corsOrigin,
};
