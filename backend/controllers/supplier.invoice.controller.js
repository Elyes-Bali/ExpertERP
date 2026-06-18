import { SInvoice } from "../models/supplier.invoice.model.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Tax } from "../models/tax.model.js";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Supplier } from "../models/supplier.model.js";
import axios from "axios";
import puppeteer from "puppeteer-core";
import { execSync } from "child_process";
import { supplierInvoiceTemplate } from "../templates/supplierInvoiceTemplate.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { User } from "../models/user.model.js";
import { logAction } from "../utils/auditLogger.js";
// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// 🔥 CALCULATION ENGINE

const calculateInvoice = async (items, companyId) => {
  let subtotal = 0;
  let totalVAT = 0;
  let totalTaxes = 0;

  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product).populate(
      "vat taxes unit",
    );

    if (!product) throw new Error("Product not found");

    // if (product.stock < item.quantity) {
    //   throw new Error(`Not enough stock for ${product.name}`);
    // }

    const base = product.price;

    // VAT
    let vatRate = product.vat?.value || 0;
    let vatAmount = (base * vatRate) / 100;

    // Taxes
    let taxAmount = 0;
    product.taxes.forEach((t) => {
      if (t.valueType === "percentage") {
        taxAmount += (base * t.value) / 100;
      } else {
        taxAmount += t.value;
      }
    });

    const priceWithTax = base + vatAmount + taxAmount;
    const total = priceWithTax * item.quantity;

    subtotal += base * item.quantity;
    totalVAT += vatAmount * item.quantity;
    totalTaxes += taxAmount * item.quantity;

    processedItems.push({
      product: product._id,
      name: product.name,
      unit: product.unit?.label || "", // ✅ UNIT
      quantity: item.quantity,
      price: base,
      vatRate,
      vatAmount,
      taxAmount,
      priceWithTax,
      total,
    });

    // update stock
    // product.stock += item.quantity;
    // product.inStock = product.stock > 0;
    // await product.save();
  }

  // 🔥 TIMBRE
  const timbre = await Tax.findOne({
    company: companyId,
    name: /timbre/i,
    isActive: true,
  });

  const timbreFiscal = timbre ? timbre.value : 0;

  const netPay = subtotal + totalVAT + totalTaxes + timbreFiscal;

  return {
    processedItems,
    subtotal,
    totalVAT,
    totalTaxes,
    timbreFiscal,
    netPay,
  };
};

const generateInvoiceNumber = async (companyId) => {
  const year = new Date().getFullYear();

  const count = await SInvoice.countDocuments({
    company: companyId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");

  return `SUP-INV-${year}-${nextNumber}`;
};

export const createInvoice = async (req, res) => {
  try {
    // const company = await Company.findOne({ user: req.userId });
    const user = await User.findById(req.userId);

    if (!user || !user.company) {
      return res.status(404).json({ message: "No company found" });
    }

    const company = await Company.findById(user.company);
    let logoUrl = null;

    // 1️⃣ If user uploaded a logo → use it
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "invoice_logos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      logoUrl = uploadResult.secure_url;
    } else {
      // 2️⃣ Otherwise → use company image automatically
      logoUrl = company.image || null;
    }
    const items = JSON.parse(req.body.items); // ⚠️ IMPORTANT

    const calc = await calculateInvoice(items, company._id);
    const invoiceNumber = await generateInvoiceNumber(company._id);
    const invoice = await SInvoice.create({
      company: company._id,
      invoiceNumber,
      logo: logoUrl,

      supplier: req.body.supplier,

      // ✅ DOCUMENT DETAILS
      date: req.body.date,
      warehouse: req.body.warehouse,
      project: req.body.project,
      note: req.body.note,

      items: calc.processedItems,

      subtotal: calc.subtotal,
      totalVAT: calc.totalVAT,
      totalTaxes: calc.totalTaxes,
      timbreFiscal: calc.timbreFiscal,
      netPay: calc.netPay,
    });
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ================= GET =================
export const getInvoices = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const invoices = await SInvoice.find({ company: companyId }).populate(
    "supplier warehouse project",
  );

  res.json(invoices);
};

// ================= UPDATE =================
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { isPaid } = req.body;

    const invoice = await SInvoice.findByIdAndUpdate(
      req.params.id,
      { isPaid },
      { new: true },
    ).populate("supplier warehouse project");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
// export const deleteInvoice = async (req, res) => {
//   await SInvoice.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };

export const deleteInvoice = async (req, res) => {
  try {
    // 1. GET INVOICE FIRST (IMPORTANT)
    const companyId = await getCompanyId(req.userId);
    const invoice = await SInvoice.findById(req.params.id).populate(
      "items.product",
    );

    if (!invoice) {
      return res.status(404).json({ message: "Supplier invoice not found" });
    }

    // 2. REVERSE STOCK (ERP CRITICAL LOGIC)
    for (const item of invoice.items) {
      const product = await Product.findById(item.product._id);

      if (product) {
        // supplier invoice = stock was increased → now reverse it
        product.stock -= item.quantity;

        if (product.stock < 0) product.stock = 0; // safety guard

        product.inStock = product.stock > 0;

        await product.save();
      }
    }

    // 3. DELETE INVOICE
    await SInvoice.findByIdAndDelete(req.params.id);

    // 4. AUDIT LOG
    await logAction({
      req,
      user: req.userId,
      companyId,
      action: "DELETE",
      entity: "SupplierInvoice",
      entityId: invoice._id,
      before: {
        invoiceNumber: invoice.invoiceNumber,
        supplier: invoice.supplier,
        netPay: invoice.netPay,
        itemsCount: invoice.items?.length,
      },
      message: `Supplier invoice ${invoice.invoiceNumber} deleted`,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
const getChromiumPath = () => {
  try {
    return execSync(
      "which chromium || which chromium-browser || which google-chrome",
    )
      .toString()
      .trim();
  } catch {
    return "/usr/bin/chromium";
  }
};

export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await SInvoice.findById(req.params.id).populate(
      "company supplier items.product warehouse project",
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const html = supplierInvoiceTemplate(invoice);

    const browser = await puppeteer.launch({
      executablePath: getChromiumPath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    }); // safer for some environments
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ⚠ Important: set proper headers before sending the buffer
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    // send the raw buffer
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
