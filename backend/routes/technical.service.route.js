import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";

import {
  createTechnicalService,
  getTechnicalServices,
  updateTechnicalService,
  deleteTechnicalService,
  markAsPaid,
  downloadTechnicalServicePDF,
} from "../controllers/technical.service.controller.js";

const router = express.Router();

router.post("/", verifyToken, createTechnicalService);

router.get("/", verifyToken, getTechnicalServices);

router.put("/:id", verifyToken, updateTechnicalService);

router.delete("/:id", verifyToken, deleteTechnicalService);
router.put("/:id/pay", verifyToken, markAsPaid);

router.get("/:id/pdf", verifyToken, downloadTechnicalServicePDF);

export default router;