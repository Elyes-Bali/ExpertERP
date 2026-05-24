import { Company } from "../models/company.model.js";
import { Material } from "../models/materials.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// Create Material
export const createMaterial = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const material = await Material.create({

      ...req.body,
      company: companyId,
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: "Error creating material" });
  }
};

// Get Materials
export const getMaterials = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const materials = await Material.find({ company: companyId });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching materials" });
  }
};

// Toggle Status
export const toggleMaterialStatus = async (req, res) => {
  const material = await Material.findById(req.params.id);
  material.isActive = !material.isActive;
  await material.save();
  res.json(material);
};


// Update Material
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: "Error updating material" });
  }
};

// Delete Material
export const deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: "Material deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting material" });
  }
};