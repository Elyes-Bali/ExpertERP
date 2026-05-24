import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);