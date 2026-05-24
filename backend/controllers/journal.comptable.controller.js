import { JournalComptable } from "../models/journal.comptable.model.js";
// 🔹 CREATE
export const createJournal = async (req, res) => {
  try {
    const journal = await JournalComptable.create(req.body);
    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET ALL
export const getJournals = async (req, res) => {
  try {
    const journals = await JournalComptable.find().sort({ code: 1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 UPDATE
export const updateJournal = async (req, res) => {
  try {
    const journal = await JournalComptable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE
export const deleteJournal = async (req, res) => {
  try {
    await JournalComptable.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};