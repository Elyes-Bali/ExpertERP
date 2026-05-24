import mongoose from "mongoose";

const compteFinancierSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    label: { type: String, required: true }, // libellé

    typeCompte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeCompte",
      required: true,
    },

    devise: {
      type: String,
      default: "TND",
    },

    country: {
      type: String,
      default: "Tunisia",
    },

    initialBalance: Number,
    currentBalance: Number,

    date: { type: Date, default: Date.now },

    minAuthorizedBalance: Number,
    desiredMinBalance: Number,

    bankName: String,
    accountNumber: String,
    iban: String,
    bic: String,

    ownerName: String,
    ownerAddress: String,

    // 🔹 Accounting
    compteComptable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanComptable",
      required: true,
    },

    journal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalComptable",
      required: true,
    },
  },
  { timestamps: true }
);

export const CompteFinancier = mongoose.model(
  "CompteFinancier",
  compteFinancierSchema
);