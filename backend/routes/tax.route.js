import express from "express";
import {
  createTax,
  getTaxes,
  toggleTax,
  setVAT,
  getVAT,
  updateTax,
  deleteTax,
  updateVAT,
  deleteVAT,
} from "../controllers/tax.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// TAX
router.post("/tax", verifyToken, createTax);
router.get("/tax", verifyToken, getTaxes);
router.put("/tax/:id/toggle", verifyToken, toggleTax);

router.put("/tax/:id", verifyToken, updateTax);
router.delete("/tax/:id", verifyToken, deleteTax);

// VAT
router.post("/vat", verifyToken, setVAT);
router.get("/vat", verifyToken, getVAT);

router.put("/vat", verifyToken, updateVAT);
router.delete("/vat", verifyToken, deleteVAT);

export default router;