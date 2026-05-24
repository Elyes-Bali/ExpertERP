import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  unit: String,
  quantity: { type: Number, required: true },
  price: Number,
  vat: Number,
  taxes: Number,
  priceWithTax: Number,
  total: Number,
});

const orderSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    logo: String, // Cloudinary URL

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    // 🔹 Document details
    date: { type: Date, default: Date.now },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    note: String,

    // 🔹 Products
    items: [orderItemSchema],
    orderNumber: {
      type: String,
      unique: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    // 🔹 Totals
    subtotal: Number,
    totalVAT: Number,
    totalTaxes: Number,
    timbreFiscal: Number,
    netPay: Number,
  },

  { timestamps: true },
);

export const SOrder = mongoose.model("SOrder", orderSchema);
