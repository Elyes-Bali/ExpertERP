import { JournalComptable } from "../models/journal.comptable.model.js";
import { journalCompatble } from "./defaultJournalComptable.js";

export const seedJournalComptable = async () => {
  try {
    const count = await JournalComptable.countDocuments();

    if (count === 0) {
      await JournalComptable.insertMany(journalCompatble);
      console.log("✅ Journal Comptable seeded");
    } else {
      console.log("ℹ️ Journal Comptable already exists");
    }
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
};