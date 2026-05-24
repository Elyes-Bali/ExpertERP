import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";

import {
  createInternetPayment,
  getInternetPayments,
  getClientPaymentHistory,
  deleteInternetPayment,
  downloadInternetPaymentPDF,
} from "../controllers/internet.payment.controller.js";

const router = express.Router();

router.post("/", verifyToken, createInternetPayment);

router.get("/", verifyToken, getInternetPayments);

router.get(
  "/client/:clientId",
  verifyToken,
  getClientPaymentHistory
);

router.delete("/:id", verifyToken, deleteInternetPayment);

router.get("/:id/pdf", verifyToken, downloadInternetPaymentPDF);

export default router;