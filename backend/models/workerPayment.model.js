import mongoose from "mongoose";

const workerPaymentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },

    salaryAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paidAt: Date,

    compteFinancier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompteFinancier",
    },
  },
  { timestamps: true }
);

workerPaymentSchema.index({ worker: 1, month: 1, year: 1 }, { unique: true });

export const WorkerPayment = mongoose.model(
  "WorkerPayment",
  workerPaymentSchema
);