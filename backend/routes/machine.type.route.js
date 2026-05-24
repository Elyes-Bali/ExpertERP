import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createMachineType, deleteMachineType, getMachineTypes, toggleMachineTypeStatus, updateMachineType } from "../controllers/machine.type.controller.js";


const router = express.Router();

// MACHINE TYPES
router.post("/machine-types", verifyToken, createMachineType);
router.get("/machine-types", verifyToken, getMachineTypes);
router.put("/machine-types/:id/toggle", verifyToken, toggleMachineTypeStatus);

router.put("/machine-types/:id", verifyToken, updateMachineType);
router.delete("/machine-types/:id", verifyToken, deleteMachineType);

export default router;