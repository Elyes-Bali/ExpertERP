import express from "express";
import {
  createWorker,
  getWorkers,
  paySalary,
  getPayments,
  updateWorker,
  deleteWorker,
} from "../controllers/worker.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createWorker);
router.get("/", verifyToken, getWorkers); // Simplified URL
router.post("/pay", verifyToken, paySalary);
router.get("/payments", verifyToken, getPayments);
router.put("/:id", verifyToken, updateWorker);
router.delete("/:id", verifyToken, deleteWorker);
export default router;