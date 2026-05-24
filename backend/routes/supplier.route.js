import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../controllers/supplier.controller.js";

const router = express.Router();

router.post("/suppliers", verifyToken, createSupplier);
router.get("/suppliers", verifyToken, getSuppliers);
router.put("/suppliers/:id", verifyToken, updateSupplier);
router.delete("/suppliers/:id", verifyToken, deleteSupplier);

export default router;