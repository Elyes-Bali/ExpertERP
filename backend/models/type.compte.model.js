import mongoose from "mongoose";

const typeCompteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const TypeCompte = mongoose.model("TypeCompte", typeCompteSchema);