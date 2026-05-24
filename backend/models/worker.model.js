import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    fullName: { type: String, required: true },

    phone: String,
    address: String,

    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      default: "single",
    },

    bankAccountNumber: String,
    iban: String,
    bic: String,
    bankName: String,

    salary: {
      type: Number,
      required: true,
    },

    hireDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Worker = mongoose.model("Worker", workerSchema);