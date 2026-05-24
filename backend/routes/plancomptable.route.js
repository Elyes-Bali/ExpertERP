import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
} from "../controllers/plancomptable.controller.js";

const router = express.Router();

router.get("/", verifyToken, getPlans);
router.post("/", verifyToken, createPlan);
router.put("/:id", verifyToken, updatePlan);
router.delete("/:id", verifyToken, deletePlan);

export default router;