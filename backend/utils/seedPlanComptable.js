import { PlanComptable } from "../models/plan.comptable.model.js";
import { planComptables } from "./defaultPlanComptable.js";

export const seedPlanComptable = async () => {
  try {
    const count = await PlanComptable.countDocuments();

    if (count === 0) {
      await PlanComptable.insertMany(planComptables);
      console.log("✅ Plan Comptable seeded");
    } else {
      console.log("ℹ️ Plan Comptable already exists");
    }
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
};