import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
    restriction: {
      type: String,
      enum: ["all", "sale", "purchase"],
      default: "all",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);