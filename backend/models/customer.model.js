import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
     type: {
      type: String,
      enum: ["individual", "professional"],
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
     companyname: {
      type: String,  
    },
     website: {
      type: String,  
    },
    taxnumber: {
      type: String,  
    },
   
   civility: {
      type: String,
      enum: ["Mr", "Ms"],
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

export const Customer = mongoose.model("Customer", customerSchema);