import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

import { createOrder, deleteOrder, downloadOrderPDF, getOrders, updateOrderStatus } from "../controllers/supplier.order.controller.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("logo"), createOrder);
router.get("/", verifyToken, getOrders);
router.delete("/:id", verifyToken, deleteOrder);
router.put("/:id/status", verifyToken, updateOrderStatus);
router.get("/pdf/:id", verifyToken, downloadOrderPDF);
export default router;