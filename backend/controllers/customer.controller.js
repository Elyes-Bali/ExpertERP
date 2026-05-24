import { Customer } from "../models/customer.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// ================= CREATE =================
export const createCustomer = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const customer = await Customer.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating customer" });
  }
};

// ================= GET =================
export const getCustomers = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const customers = await Customer.find({ company: companyId });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// ================= UPDATE =================
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Error updating customer" });
  }
};

// ================= DELETE =================
export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};