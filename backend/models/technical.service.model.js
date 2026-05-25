import mongoose from "mongoose";

const technicalMaterialSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },

  quantityUsed: {
    type: Number,
    required: true,
    default: 1,
  },

  price: {
    type: Number,
    default: 0,
  },
});

const technicalServiceSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    clientNumber: {
      type: String,
      required: true,
    },

    machineType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MachineType",
      required: true,
    },

    brand: {
      type: String,
     
    },

    serialNumber: String,

    accessories: String,

    observations: String,

    technicianName: String,

    workforcePrice: {
      type: Number,
      default: 0,
    },

    materials: [technicalMaterialSchema],

    materialsPrice: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },

    repairStatus: {
      type: String,
      enum: ["fixed", "being repaired", "unrepairable"],
      default: "being repaired",
    },

    paidStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    depositDate: {
      type: Date,
      default: Date.now,
    },

    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const TechnicalService = mongoose.model(
  "TechnicalService",
  technicalServiceSchema
);