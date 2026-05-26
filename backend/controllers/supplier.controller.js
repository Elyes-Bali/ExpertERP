import { Supplier } from "../models/supplier.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { logAction } from "../utils/auditLogger.js";
import { User } from "../models/user.model.js";
// 🔹 Get company ID
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// ================= CREATE =================
export const createSupplier = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const supplier = await Supplier.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating supplier" });
  }
};

// ================= GET =================
export const getSuppliers = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const suppliers = await Supplier.find({ company: companyId });

    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suppliers" });
  }
};

// ================= UPDATE =================
// export const updateSupplier = async (req, res) => {
//   try {
//     const supplier = await Supplier.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(supplier);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating supplier" });
//   }
// };

export const updateSupplier = async (req, res) => {
  try {
    // 1️⃣ Get BEFORE state
    const companyId = await getCompanyId(req.userId); 
    const existingSupplier = await Supplier.findById(req.params.id);

    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // 2️⃣ Update
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 3️⃣ Audit log
    await logAction({
      req,
      user: req.userId,
      companyId,
      action: "UPDATE",
      entity: "Supplier",
      entityId: existingSupplier._id,
      before: existingSupplier,
      after: updatedSupplier,
      message: `Supplier ${existingSupplier.name || existingSupplier._id} updated`,
    });

    res.json(updatedSupplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating supplier" });
  }
};

// ================= DELETE =================
// export const deleteSupplier = async (req, res) => {
//   try {
//     await Supplier.findByIdAndDelete(req.params.id);
//     res.json({ message: "Supplier deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting supplier" });
//   }
// };

export const deleteSupplier = async (req, res) => {
  try {
    // 1️⃣ Fetch BEFORE delete
    const companyId = await getCompanyId(req.userId); 
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // 2️⃣ Delete
    await Supplier.findByIdAndDelete(req.params.id);

    // 3️⃣ Audit log
    await logAction({
      req,
      user: req.userId,
      companyId,
      action: "DELETE",
      entity: "Supplier",
      entityId: supplier._id,
      before: supplier,
      message: `Supplier ${supplier.name || supplier._id} deleted`,
    });

    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting supplier" });
  }
};