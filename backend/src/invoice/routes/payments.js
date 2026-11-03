import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getPayment,
  listPayments,
  updatePayment,
} from "../controllers/paymentsController.js";

const router = Router();

router.get("/", listPayments);
router.get("/:id", getPayment);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
