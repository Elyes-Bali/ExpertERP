import { Company } from "../models/company.model.js";
import { ContractType } from "../models/contract.type.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// // 🔹 Get company ID from user
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };


// Create Contract Type
export const createContractType = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const contractType = await ContractType.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(contractType);
  } catch (err) {
    res.status(500).json({ message: "Error creating contract type" });
  }
};



// Get Contract Types
export const getContractTypes = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const contractTypes = await ContractType.find({ company: companyId });

    res.json(contractTypes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contract types" });
  }
};

// Toggle Status
export const toggleContractTypeStatus = async (req, res) => {
  const contractType = await ContractType.findById(req.params.id);
  contractType.isActive = !contractType.isActive;
  await contractType.save();
  res.json(contractType);
};


// Update Contract Type
export const updateContractType = async (req, res) => {
  try {
    const contractType = await ContractType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(contractType);
  } catch (err) {
    res.status(500).json({ message: "Error updating contract type" });
  }
};

// Delete Contract Type
export const deleteContractType = async (req, res) => {
  try {
    await ContractType.findByIdAndDelete(req.params.id);
    res.json({ message: "Contract type deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contract type" });
  }
};