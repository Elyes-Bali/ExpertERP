import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Unit = mongoose.model("Unit", unitSchema);