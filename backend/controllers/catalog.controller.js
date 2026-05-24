import { Company } from "../models/company.model.js";
import { Category } from "../models/category.model.js";
import { Unit } from "../models/unit.model.js";
import { Brand } from "../models/brand.model.js";
import { defaultUnits } from "../utils/defaultUnits.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

//////////////////////////////////////////////////////
// CATEGORY CRUD
//////////////////////////////////////////////////////

export const createCategory = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const category = await Category.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(category);
  } catch {
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategories = async (req, res) => {
  const companyId = await getCompanyId(req.userId);
  const data = await Category.find({ company: companyId });
  res.json(data);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

//////////////////////////////////////////////////////
// UNIT CRUD + AUTO DEFAULT
//////////////////////////////////////////////////////

export const getUnits = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  let units = await Unit.find({ company: companyId });

  // 🔥 Auto-create defaults if empty
  if (units.length === 0) {
    const defaultData = defaultUnits.map((u) => ({
      ...u,
      company: companyId,
      isDefault: true,
    }));

    await Unit.insertMany(defaultData);
    units = await Unit.find({ company: companyId });
  }

  res.json(units);
};

export const createUnit = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const unit = await Unit.create({
    ...req.body,
    company: companyId,
  });

  res.status(201).json(unit);
};

export const updateUnit = async (req, res) => {
  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(unit);
};

export const deleteUnit = async (req, res) => {
  await Unit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

//////////////////////////////////////////////////////
// BRAND CRUD
//////////////////////////////////////////////////////

export const createBrand = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const brand = await Brand.create({
    ...req.body,
    company: companyId,
  });

  res.status(201).json(brand);
};

export const getBrands = async (req, res) => {
  const companyId = await getCompanyId(req.userId);
  const brands = await Brand.find({ company: companyId });
  res.json(brands);
};

export const updateBrand = async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(brand);
};

export const deleteBrand = async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};