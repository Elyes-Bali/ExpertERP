import { PlanComptable } from "../models/plan.comptable.model.js";

// 🔹 CREATE
export const createPlan = async (req, res) => {
  try {
    const plan = await PlanComptable.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET ALL
export const getPlans = async (req, res) => {
  try {
    const plans = await PlanComptable.find().sort({ code: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 UPDATE
export const updatePlan = async (req, res) => {
  try {
    const plan = await PlanComptable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE
export const deletePlan = async (req, res) => {
  try {
    await PlanComptable.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};