import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // 🔹 BASIC
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["material", "composite", "service"],
      required: true,
    },

    // 🔹 TAXES
    vat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VAT",
    },

    taxes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax",
      },
    ],

    price: { type: Number, required: true },
    priceWithTax: { type: Number },

    includeTaxes: { type: Boolean, default: false },

    // 🔹 STOCK
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },

    // 🔹 LOGISTICS
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    // 🔹 EXTRA
    image: { type: String },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },

    internalRef: String,
    manufacturerRef: String,
    description: String,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);