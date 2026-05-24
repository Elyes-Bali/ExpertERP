import mongoose from "mongoose";

const journalComptableSchema = new mongoose.Schema(
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

export const JournalComptable = mongoose.model("JournalComptable", journalComptableSchema);