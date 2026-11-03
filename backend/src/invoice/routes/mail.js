import { Router } from "express";
import { sendInvoiceMail } from "../controllers/mailController.js";

const router = Router();

router.post("/send", sendInvoiceMail);

export default router;
