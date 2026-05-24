import { CompteFinancier } from "../models/compte.financier.model.js";
import { Company } from "../models/company.model.js";
import { PlanComptable } from "../models/plan.comptable.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// ================= CREATE =================
// export const createCompte = async (req, res) => {
//   try {
//     const companyId = await getCompanyId(req.userId);

//     // 🔥 Only allow compte comptable starting with 53
//     const compte = await PlanComptable.findById(req.body.compteComptable);

//     if (!compte || !compte.code.startsWith("53")) {
//       return res
//         .status(400)
//         .json({ message: "Only comptes with code 53 allowed" });
//     }

//     const newCompte = await CompteFinancier.create({
//       ...req.body,
//       company: companyId,
//       currentBalance: req.body.initialBalance,
//     });

//     res.status(201).json(newCompte);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const createCompte = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    // ✅ 🔥 NEW: check if a compte already exists
    const existingCompte = await CompteFinancier.findOne({
      company: companyId,
    });

    if (existingCompte) {
      return res.status(400).json({
        message: "You can only create one financial account",
      });
    }

    // 🔥 Only allow compte comptable starting with 53
    const compte = await PlanComptable.findById(req.body.compteComptable);

    if (!compte || !compte.code.startsWith("53")) {
      return res
        .status(400)
        .json({ message: "Only comptes with code 53 allowed" });
    }

    const newCompte = await CompteFinancier.create({
      ...req.body,
      company: companyId,
      currentBalance: req.body.initialBalance,
    });

    res.status(201).json(newCompte);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET =================
export const getComptes = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const comptes = await CompteFinancier.find({ company: companyId })
    .populate("typeCompte journal compteComptable");

  res.json(comptes);
};

// ================= UPDATE =================
export const updateCompte = async (req, res) => {
  try {
    const compte = await CompteFinancier.findById(req.params.id);

    if (!compte) {
      return res.status(404).json({ message: "Compte not found" });
    }

    // 🔥 check compte comptable 53 rule again
    if (req.body.compteComptable) {
      const plan = await PlanComptable.findById(req.body.compteComptable);

      if (!plan || !plan.code.startsWith("53")) {
        return res
          .status(400)
          .json({ message: "Only comptes with code 53 allowed" });
      }
    }

    const updated = await CompteFinancier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
export const deleteCompte = async (req, res) => {
  await CompteFinancier.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};