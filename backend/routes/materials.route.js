import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createMaterial, deleteMaterial, getMaterials, toggleMaterialStatus, updateMaterial } from "../controllers/materials.controller.js";


const router = express.Router();

// MATERIALS
router.post("/materials", verifyToken, createMaterial);
router.get("/materials", verifyToken, getMaterials);
router.put("/materials/:id/toggle", verifyToken, toggleMaterialStatus);

router.put("/materials/:id", verifyToken, updateMaterial);
router.delete("/materials/:id", verifyToken, deleteMaterial);

export default router;