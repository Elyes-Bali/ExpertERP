import mongoose from "mongoose";

const plancomptableSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const PlanComptable = mongoose.model("PlanComptable", plancomptableSchema);