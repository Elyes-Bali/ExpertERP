import { TypeCompte } from "../models/type.compte.model.js";


export const createTypeCompte = async (req, res) => {
  try {
    const typeCompte = await TypeCompte.create(req.body);
    res.status(201).json(typeCompte);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET ALL
export const getTypeComptes = async (req, res) => {
  try {
    const typeComptes = await TypeCompte.find().sort({ name: 1 });
    res.json(typeComptes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 UPDATE
export const updateTypeCompte = async (req, res) => {
  try {
    const typeCompte = await TypeCompte.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(typeCompte);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE
export const deleteTypeCompte = async (req, res) => {
  try {
    await TypeCompte.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};