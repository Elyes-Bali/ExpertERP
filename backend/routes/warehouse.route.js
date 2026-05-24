import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createWarehouse,getWarehouses,toggleWarehouseStatus,updateWarehouse,deleteWarehouse } from "../controllers/warehouse.controller.js";


const router = express.Router();

// WAREHOUSES
router.post("/warehouses", verifyToken, createWarehouse);
router.get("/warehouses", verifyToken, getWarehouses);
router.put("/warehouses/:id/toggle", verifyToken, toggleWarehouseStatus);

router.put("/warehouses/:id", verifyToken, updateWarehouse);
router.delete("/warehouses/:id", verifyToken, deleteWarehouse);

export default router;