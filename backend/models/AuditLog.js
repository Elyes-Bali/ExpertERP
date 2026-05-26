// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
     company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE",
        "UPDATE",
        "DELETE",
        "VIEW",
      ],
    },

    entity: {
      type: String, // "Invoice", "Product", "Stock"
    },

    entityId: {
      type: String,
    },

    before: {
      type: Object,
    },

    after: {
      type: Object,
    },

    message: String,

    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);


export const AuditLog = mongoose.model("AuditLog", auditLogSchema);