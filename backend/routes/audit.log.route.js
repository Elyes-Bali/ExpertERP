import express from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, getAuditLogs);

export default router;