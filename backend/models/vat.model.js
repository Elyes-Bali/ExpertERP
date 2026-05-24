import mongoose from "mongoose";

const vatSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    operation: {
      type: String,
      enum: ["add", "subtract"],
      default: "add",
    },

    value: {
      type: Number, // always %
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const VAT = mongoose.model("VAT", vatSchema);