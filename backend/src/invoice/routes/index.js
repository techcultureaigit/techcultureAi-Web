import { Router } from "express";
import { ensureInvoiceIndexes } from "../db.js";
import { requireInvoiceAdmin } from "../middleware/requireInvoiceAdmin.js";
import { getDashboard, getWorkspaceBundle } from "../controllers/dashboardController.js";
import authRoutes from "./auth.js";
import customersRoutes from "./customers.js";
import invoicesRoutes from "./invoices.js";
import paymentsRoutes from "./payments.js";
import receivedInvoicesRoutes from "./receivedInvoices.js";
import settingsRoutes from "./settings.js";
import mailRoutes from "./mail.js";

const router = Router();

let indexesReady = false;
router.use(async (_req, _res, next) => {
  if (!indexesReady) {
    try {
      await ensureInvoiceIndexes();
      indexesReady = true;
    } catch (err) {
      console.warn("[invoice] index ensure skipped:", err.message);
    }
  }
  next();
});

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "techculture-invoice-api",
    collections: [
      "invoice_customers",
      "invoice_invoices",
      "invoice_payments",
      "invoice_received_invoices",
      "invoice_settings",
    ],
  });
});

// Public auth (admin login only)
router.use("/auth", authRoutes);

// Protected invoice data — admin JWT required
router.use(requireInvoiceAdmin);

router.get("/dashboard", getDashboard);
router.get("/workspace", getWorkspaceBundle);

router.use("/customers", customersRoutes);
router.use("/invoices", invoicesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/received-invoices", receivedInvoicesRoutes);
router.use("/settings", settingsRoutes);
router.use("/mail", mailRoutes);

export default router;
