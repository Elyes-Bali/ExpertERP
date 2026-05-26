// utils/auditLogger.js
import { AuditLog } from "../models/AuditLog.js";
import { Company } from "../models/company.model.js";

export const logAction = async ({
  req,
  user,
  companyId,
  action,
  entity,
  entityId,
  before,
  after,
  message,
}) => {
  try {
    await AuditLog.create({
      company: companyId,   // 🔥 REQUIRED
      user: user?._id || user,
      action,
      entity,
      entityId,
      before,
      after,
      message,
      ip: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (err) {
    console.log("Audit log error:", err.message);
  }
};