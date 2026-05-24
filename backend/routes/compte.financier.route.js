import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createCompte,
  getComptes,
  deleteCompte,
  updateCompte,
} from "../controllers/compte.financier.controller.js";

const router = express.Router();

router.post("/", verifyToken, createCompte);
router.get("/", verifyToken, getComptes);
router.delete("/:id", verifyToken, deleteCompte);
router.put("/:id", verifyToken, updateCompte);

export default router;