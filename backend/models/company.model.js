import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one company per user
    },
    name: {
      type: String,
      required: true,
    },
    taxNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    image: {
      type: String, // Cloudinary URL
      default: null,
    },
    qrImage: {
      type: String, // Cloudinary URL
      default: null,
    },
    address: {
      country: String,
      region: String,
      addressLine: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);