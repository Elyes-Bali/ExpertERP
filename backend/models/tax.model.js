import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    context: {
      type: String,
      enum: ["all", "sale", "purchase"],
      default: "all",
    },

    valueType: {
      type: String,
      enum: ["fixed", "percentage"], // 1 TND or 1%
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    operation: {
      type: String,
      enum: ["add", "subtract"],
      default: "add",
    },

    applyOnProducts: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Tax = mongoose.model("Tax", taxSchema);