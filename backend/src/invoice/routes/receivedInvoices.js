import { Router } from "express";
import {
  createReceivedInvoice,
  deleteReceivedInvoice,
  getReceivedInvoice,
  listReceivedInvoices,
  updateReceivedInvoice,
} from "../controllers/receivedInvoicesController.js";

const router = Router();

router.get("/", listReceivedInvoices);
router.get("/:id", getReceivedInvoice);
router.post("/", createReceivedInvoice);
router.put("/:id", updateReceivedInvoice);
router.patch("/:id", updateReceivedInvoice);
router.delete("/:id", deleteReceivedInvoice);

export default router;
