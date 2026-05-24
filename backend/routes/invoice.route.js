import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadCompanyFiles } from "../middleware/multerCompany.js";
import {
  createInvoice,
  getInvoices,
  deleteInvoice,
  downloadInvoicePDF,
  updateInvoiceStatus,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/", verifyToken, uploadCompanyFiles, createInvoice);
router.get("/", verifyToken, getInvoices);
router.delete("/:id", verifyToken, deleteInvoice);
router.put("/:id/status", verifyToken, updateInvoiceStatus);
router.get("/pdf/:id", verifyToken, downloadInvoicePDF);
export default router;