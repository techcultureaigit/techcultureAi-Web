import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  downloadInvoicePdf,
  getInvoice,
  listInvoices,
  updateInvoice,
} from "../controllers/invoicesController.js";

const router = Router();

router.get("/", listInvoices);
router.get("/:id/pdf", downloadInvoicePdf);
router.get("/:id", getInvoice);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
