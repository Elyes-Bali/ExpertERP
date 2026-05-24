import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadCompanyFiles } from "../middleware/multerCompany.js";
import { createClientOrder, deleteClientOrder, downloadClientOrderPDF, getClientOrders, updateClientOrderStatus } from "../controllers/client.order.controller.js";

const router = express.Router();

router.post("/", verifyToken, uploadCompanyFiles, createClientOrder);
router.get("/", verifyToken, getClientOrders);
router.delete("/:id", verifyToken, deleteClientOrder);
router.put("/:id/status", verifyToken, updateClientOrderStatus);
router.get("/pdf/:id", verifyToken, downloadClientOrderPDF);
export default router;