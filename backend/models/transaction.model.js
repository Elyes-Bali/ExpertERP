import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    compte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompteFinancier",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT"], // IN = income, OUT = expense
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    source: {
      type: String, // e.g. "ClientOrder"
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    description: String,

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);