import mongoose from "mongoose";

const internetClientSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
   
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },  
    phone: {
      type: Number,
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

export const InternetClient = mongoose.model("InternetClient", internetClientSchema);