import { Tax } from "../models/tax.model.js";
import { VAT } from "../models/vat.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// 🔹 Get company ID from user
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// ================= TAX =================

// Create Tax
export const createTax = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const tax = await Tax.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(tax);
  } catch (err) {
    res.status(500).json({ message: "Error creating tax" });
  }
};

// Get Taxes
export const getTaxes = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const taxes = await Tax.find({ company: companyId });

    res.json(taxes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching taxes" });
  }
};

// Toggle Status
export const toggleTax = async (req, res) => {
  const tax = await Tax.findById(req.params.id);
  tax.isActive = !tax.isActive;
  await tax.save();
  res.json(tax);
};

// ================= VAT =================

// Create or Update VAT (one per company)
export const setVAT = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    let vat = await VAT.findOne({ company: companyId });

    if (vat) {
      vat.operation = req.body.operation;
      vat.value = req.body.value;
      vat.isActive = req.body.isActive;
      await vat.save();
    } else {
      vat = await VAT.create({
        company: companyId,
        ...req.body,
      });
    }

    res.json(vat);
  } catch (err) {
    res.status(500).json({ message: "Error saving VAT" });
  }
};

export const getVAT = async (req, res) => {
  const companyId = await getCompanyId(req.userId);
  const vat = await VAT.findOne({ company: companyId });
  res.json(vat);
};


// Update Tax
export const updateTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(tax);
  } catch (err) {
    res.status(500).json({ message: "Error updating tax" });
  }
};

// Delete Tax
export const deleteTax = async (req, res) => {
  try {
    await Tax.findByIdAndDelete(req.params.id);
    res.json({ message: "Tax deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tax" });
  }
};


// ================= VAT =================

// Update VAT
export const updateVAT = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const vat = await VAT.findOneAndUpdate(
      { company: companyId },
      req.body,
      { new: true }
    );

    res.json(vat);
  } catch (err) {
    res.status(500).json({ message: "Error updating VAT" });
  }
};

// Delete VAT
export const deleteVAT = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    await VAT.findOneAndDelete({ company: companyId });

    res.json({ message: "VAT deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting VAT" });
  }
};