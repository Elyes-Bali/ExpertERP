// controllers/auditLog.controller.js
import { AuditLog } from "../models/AuditLog.js";
import { getCompanyId } from "../utils/getCompanyId.js";

export const getAuditLogs = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const logs = await AuditLog.find({ company: companyId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: err.message,
    });
  }
};