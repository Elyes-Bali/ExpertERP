import { Warehouse } from "../models/warehouse.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// 🔹 Get company ID from user
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };


// Create Warehouse
export const createWarehouse = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const warehouse = await Warehouse.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(warehouse);
  } catch (err) {
    res.status(500).json({ message: "Error creating warehouse" });
  }
};

// Get Warehouses
export const getWarehouses = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const warehouses = await Warehouse.find({ company: companyId });

    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching warehouses" });
  }
};

// Toggle Status
export const toggleWarehouseStatus = async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id);
  warehouse.isActive = !warehouse.isActive;
  await warehouse.save();
  res.json(warehouse);
};


// Update Warehouse
export const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: "Error updating warehouse" });
  }
};

// Delete Warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    await Warehouse.findByIdAndDelete(req.params.id);
    res.json({ message: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting warehouse" });
  }
};