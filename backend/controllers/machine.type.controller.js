import { Company } from "../models/company.model.js";
import { MachineType } from "../models/machine.type.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// Create Machine Type
export const createMachineType = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const machineType = await MachineType.create({

      ...req.body,
      company: companyId,
    });

    res.status(201).json(machineType);
  } catch (err) {
    res.status(500).json({ message: "Error creating machine type" });
  }
};

// Get Machine Types
export const getMachineTypes = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const machineTypes = await MachineType.find({ company: companyId });

    res.json(machineTypes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching machine types" });
  }
};

// Toggle Status
export const toggleMachineTypeStatus = async (req, res) => {
  const machineType = await MachineType.findById(req.params.id);
  machineType.isActive = !machineType.isActive;
  await machineType.save();
  res.json(machineType);
};


// Update Machine Type
export const updateMachineType = async (req, res) => {
  try {
    const machineType = await MachineType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(machineType);
  } catch (err) {
    res.status(500).json({ message: "Error updating machine type" });
  }
};

// Delete Machine Type
export const deleteMachineType = async (req, res) => {
  try {
    await MachineType.findByIdAndDelete(req.params.id);
    res.json({ message: "Machine type deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting machine type" });
  }
};