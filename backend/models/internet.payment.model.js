import mongoose from "mongoose";

const internetPaymentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternetClient",
      required: true,
    },

    contractType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContractType",
      required: true,
    },

    contractCode: {
      type: String,
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    paidPrice: {
      type: Number,
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const InternetPayment = mongoose.model(
  "InternetPayment",
  internetPaymentSchema
);