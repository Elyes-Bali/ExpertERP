import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Tax } from "../models/tax.model.js";
import { VAT } from "../models/vat.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import XLSX from "xlsx";
// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// 🔥 TAX CALCULATION ENGINE
const calculatePriceWithTax = async (price, taxesIds, vatId) => {
  let finalPrice = price;

  // VAT
  if (vatId) {
    const vat = await VAT.findById(vatId);
    if (vat && vat.isActive) {
      finalPrice += (price * vat.value) / 100;
    }
  }

  // Taxes
  if (taxesIds?.length) {
    const taxes = await Tax.find({ _id: { $in: taxesIds }, isActive: true });

    taxes.forEach((tax) => {
      if (tax.valueType === "percentage") {
        const amount = (price * tax.value) / 100;
        finalPrice =
          tax.operation === "add" ? finalPrice + amount : finalPrice - amount;
      } else {
        finalPrice =
          tax.operation === "add"
            ? finalPrice + tax.value
            : finalPrice - tax.value;
      }
    });
  }

  return finalPrice;
};

// ================= CRUD =================

// CREATE
export const createProduct = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    let priceWithTax = req.body.price;

    if (req.body.includeTaxes) {
      priceWithTax = await calculatePriceWithTax(
        req.body.price,
        req.body.taxes,
        req.body.vat,
      );
    }

    const product = await Product.create({
      ...req.body,
      company: companyId,
      priceWithTax,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
};

// GET
export const getProducts = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const products = await Product.find({ company: companyId }).populate(
    "category brand unit warehouse taxes vat",
  );

  res.json(products);
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    let priceWithTax = req.body.price;

    if (req.body.includeTaxes) {
      priceWithTax = await calculatePriceWithTax(
        req.body.price,
        req.body.taxes,
        req.body.vat,
      );
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, priceWithTax },
      { new: true },
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};


export const importProductsFromExcel = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 📥 Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    // 🧱 1. Validate headers
    const requiredFields = ["name", "price"];
    const fileFields = Object.keys(data[0]);

    const missingFields = requiredFields.filter(
      (field) => !fileFields.includes(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Invalid Excel format. Missing fields: ${missingFields.join(", ")}`,
      });
    }

    // 🧱 2. Validate rows
    const validProducts = [];
    const errors = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row index (header = 1)

      if (!row.name || !row.price) {
        errors.push(`Row ${rowNumber}: Missing name or price`);
        return;
      }

      const price = Number(row.price);

      if (isNaN(price)) {
        errors.push(`Row ${rowNumber}: Invalid price`);
        return;
      }

      const stock = Number(row.stock || 0);

      validProducts.push({
        company: companyId,
        name: row.name,
        type: row.type || "material",
        price,
        stock,
        description: row.description || "",
        height: Number(row.height || 0),
        width: Number(row.width || 0),
        weight: Number(row.weight || 0),
        inStock: stock > 0,
      });
    });

    // 🛑 Stop if no valid data
    if (validProducts.length === 0) {
      return res.status(400).json({
        message: "No valid products found in file",
        errors,
      });
    }

    // 🚀 3. Bulk upsert (no duplicates)
    const bulkOps = validProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name, company: companyId },
        update: { $set: product },
        upsert: true,
      },
    }));

    await Product.bulkWrite(bulkOps);

    // ✅ Final response
    res.status(200).json({
      message: `${validProducts.length} products imported successfully 🚀`,
      errors, // send warnings (optional)
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    res.status(500).json({ message: "Import failed, No valid products found in file" });
  }
};
