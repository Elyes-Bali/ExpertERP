import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createTypeCompte, deleteTypeCompte, getTypeComptes, updateTypeCompte } from "../controllers/type.compote.controller.js";


const router = express.Router();

router.get("/", verifyToken, getTypeComptes);
router.post("/", verifyToken, createTypeCompte);
router.put("/:id", verifyToken, updateTypeCompte);
router.delete("/:id", verifyToken, deleteTypeCompte);

export default router;