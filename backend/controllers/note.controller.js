import { Company } from "../models/company.model.js";
import { Note } from "../models/note.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// Create Note
export const createNote = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const note = await Note.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
};

// Get Notes
export const getNotes = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const notes = await Note.find({ company: companyId });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
