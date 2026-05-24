import { Worker } from "../models/worker.model.js";
import { WorkerPayment } from "../models/workerPayment.model.js";
import { CompteFinancier } from "../models/compte.financier.model.js";
import { Company } from "../models/company.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };
// CREATE WORKER
export const createWorker = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    if (!companyId) {
      return res.status(404).json({ message: "Company not found" });
    }

    const worker = await Worker.create({
      ...req.body,
      company: companyId, // ✅ inject it here
    });

    res.status(201).json(worker);
  } catch (err) {
    console.log("CREATE WORKER ERROR:", err);
    res.status(500).json({
      message: err.message,
      error: err,
    });
  }
};

// GET WORKERS BY COMPANY
export const getWorkers = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId); // Fetch via Token
    const workers = await Worker.find({ company: companyId });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PAY SALARY
export const paySalary = async (req, res) => {
  try {
    const { workerId, month, year, compteId } = req.body;

    // 1. Validation: Check if IDs are actually provided
    if (!workerId || !compteId || !month || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Find documents
    const worker = await Worker.findById(workerId);
    const compte = await CompteFinancier.findById(compteId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    if (!compte) {
      return res.status(404).json({ message: "Financial account not found" });
    }

    // 3. Check Balance
    if (compte.currentBalance < worker.salary) {
      return res.status(400).json({ message: "Insufficient balance in selected account" });
    }

    // 4. Update Payment (Upsert)
    // We populate 'worker' so the frontend gets the name immediately after payment
const payment = await WorkerPayment.findOneAndUpdate(
  { worker: workerId, month: Number(month), year: Number(year) },
  {
    company: worker.company,
    salaryAmount: worker.salary,
    status: "paid",
    paidAt: new Date(),
    compteFinancier: compteId,
  },
  { upsert: true, new: true }
).populate("worker");

    // 5. Subtract from account
    compte.currentBalance -= worker.salary;
    await compte.save();

    res.json(payment);
  } catch (err) {
    console.error("PAY SALARY ERROR:", err); // ALWAYS log the error to your console
    res.status(500).json({ message: err.message });
  }
};

// GET PAYMENTS
export const getPayments = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId); // Fetch via Token
    const payments = await WorkerPayment.find({ company: companyId })
      .populate("worker")
      .populate("compteFinancier");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE WORKER
export const updateWorker = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const worker = await Worker.findOneAndUpdate(
      { _id: req.params.id, company: companyId }, // 🔒 secure by company
      req.body,
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(worker);
  } catch (err) {
    console.error("UPDATE WORKER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE WORKER
export const deleteWorker = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const worker = await Worker.findOneAndDelete({
      _id: req.params.id,
      company: companyId, // 🔒 security
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // optional: delete related payments
    await WorkerPayment.deleteMany({ worker: req.params.id });

    res.json({ message: "Worker deleted successfully" });
  } catch (err) {
    console.error("DELETE WORKER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};