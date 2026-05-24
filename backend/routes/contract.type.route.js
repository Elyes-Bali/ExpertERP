import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createContractType, deleteContractType, getContractTypes, toggleContractTypeStatus, updateContractType } from "../controllers/contract.type.controller.js";


const router = express.Router();

// CONTRACT TYPES
router.post("/contract-types", verifyToken, createContractType);
router.get("/contract-types", verifyToken, getContractTypes);
router.put("/contract-types/:id/toggle", verifyToken, toggleContractTypeStatus);

router.put("/contract-types/:id", verifyToken, updateContractType);
router.delete("/contract-types/:id", verifyToken, deleteContractType);

export default router;