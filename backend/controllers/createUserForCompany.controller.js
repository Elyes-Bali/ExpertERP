import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { Company } from "../models/company.model.js";

export const createUserForCompany = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // 1. Get owner company
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 2. Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 4. Create worker/admin user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role ,
      company: company._id, // 🔥 THIS IS THE KEY
      isVerified: true, // optional: skip email verification
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("CREATE COMPANY USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};