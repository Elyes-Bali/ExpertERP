import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";
import {
  createInvoice,
  getInvoices,
  deleteInvoice,
  downloadInvoicePDF,
  updateInvoiceStatus,
} from "../controllers/supplier.invoice.controller.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("logo"), createInvoice);
router.get("/", verifyToken, getInvoices);
router.delete("/:id", verifyToken, deleteInvoice);
router.put("/:id/status", verifyToken, updateInvoiceStatus);
router.get("/pdf/:id", verifyToken, downloadInvoicePDF);
export default router;