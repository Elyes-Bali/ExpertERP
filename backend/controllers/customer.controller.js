import { Customer } from "../models/customer.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { logAction } from "../utils/auditLogger.js";
import { User } from "../models/user.model.js";
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
// export const updateCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(customer);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating customer" });
//   }
// };

export const updateCustomer = async (req, res) => {
  try {
    // 1️⃣ Get existing customer (BEFORE)
    const companyId = await getCompanyId(req.userId); 
    const existingCustomer = await Customer.findById(req.params.id);

    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 2️⃣ Update
    const updatedCustomer = await Customer.findByIdAndUpdate(
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
      entity: "Customer",
      entityId: existingCustomer._id,
      before: existingCustomer,
      after: updatedCustomer,
      message: `Customer ${existingCustomer.name || existingCustomer._id} updated`,
    });

    res.json(updatedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating customer" });
  }
};

// ================= DELETE =================
// export const deleteCustomer = async (req, res) => {
//   try {
//     await Customer.findByIdAndDelete(req.params.id);
//     res.json({ message: "Customer deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting customer" });
//   }
// };

export const deleteCustomer = async (req, res) => {
  try {
    // 1️⃣ Find before delete
    const companyId = await getCompanyId(req.userId); 
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 2️⃣ Delete
    await Customer.findByIdAndDelete(req.params.id);

    // 3️⃣ Audit log
    await logAction({
      req,
      user: req.userId,
      companyId,
      action: "DELETE",
      entity: "Customer",
      entityId: customer._id,
      before: customer,
      message: `Customer ${customer.name || customer._id} deleted`,
    });

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting customer" });
  }
};