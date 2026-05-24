import { Invoice } from "../models/invoice.model.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Tax } from "../models/tax.model.js";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Customer } from "../models/customer.model.js";
import axios from "axios";
import puppeteer from "puppeteer";
import { invoiceTemplate } from "../templates/invoiceTemplate.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { User } from "../models/user.model.js";
// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// 🔥 CALCULATION ENGINE
// const calculateInvoice = async (items, companyId) => {
//   let subtotal = 0;
//   let totalVAT = 0;
//   let totalTaxes = 0;

//   const processedItems = [];

//   for (const item of items) {
//     const product = await Product.findById(item.product).populate("vat taxes");

//     if (!product) throw new Error("Product not found");

//     // 🔴 STOCK CHECK
//     if (product.stock < item.quantity) {
//       throw new Error(`Not enough stock for ${product.name}`);
//     }

//     let base = product.price;
//     let vatAmount = 0;
//     let taxAmount = 0;

//     // VAT
//     if (product.vat) {
//       vatAmount = (base * product.vat.value) / 100;
//     }

//     // Taxes
//     if (product.taxes.length) {
//       product.taxes.forEach((t) => {
//         if (t.valueType === "percentage") {
//           taxAmount += (base * t.value) / 100;
//         } else {
//           taxAmount += t.value;
//         }
//       });
//     }

//     const priceWithTax = base + vatAmount + taxAmount;
//     const total = priceWithTax * item.quantity;

//     subtotal += base * item.quantity;
//     totalVAT += vatAmount * item.quantity;
//     totalTaxes += taxAmount * item.quantity;

//     processedItems.push({
//       product: product._id,
//       name: product.name,
//       quantity: item.quantity,
//       price: base,
//       vat: vatAmount,
//       taxes: taxAmount,
//       priceWithTax,
//       total,
//     });

//     // 🔻 DECREASE STOCK
//     product.stock -= item.quantity;
//     product.inStock = product.stock > 0;
//     await product.save();
//   }

//   // 🔥 TIMBRE (example: fixed tax)
//   const timbre = await Tax.findOne({
//     company: companyId,
//     name: /timbre/i,
//     isActive: true,
//   });

//   const timbreFiscal = timbre ? timbre.value : 0;

//   const netPay = subtotal + totalVAT + totalTaxes + timbreFiscal;

//   return {
//     processedItems,
//     subtotal,
//     totalVAT,
//     totalTaxes,
//     timbreFiscal,
//     netPay,
//   };
// };

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

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

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
    // product.stock -= item.quantity;
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

  const count = await Invoice.countDocuments({
    company: companyId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");

  return `INV-${year}-${nextNumber}`;
};

// ================= CREATE =================
// export const createInvoice = async (req, res) => {
//   try {
//     const companyId = await getCompanyId(req.userId);

//     let logoUrl = null;

//     // 🔥 CLOUDINARY
//     if (req.file) {
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "invoice_logos" },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });

//       logoUrl = uploadResult.secure_url;
//     }

//     const { processedItems, subtotal, totalVAT, totalTaxes, timbreFiscal, netPay } =
//       await calculateInvoice(req.body.items, companyId);

//     const invoice = await Invoice.create({
//       ...req.body,
//       company: companyId,
//       logo: logoUrl,
//       items: processedItems,
//       subtotal,
//       totalVAT,
//       totalTaxes,
//       timbreFiscal,
//       netPay,
//     });

//     res.status(201).json(invoice);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
export const createInvoice = async (req, res) => {
  try {
    // const company = await Company.findOne({ user: req.userId });
    const user = await User.findById(req.userId);

    if (!user || !user.company) {
      return res.status(404).json({ message: "No company found" });
    }

    const company = await Company.findById(user.company);
    let logoUrl = null;
    let qrLogoUrl = null;

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
      qrLogoUrl = uploadResult.secure_url;
    } else {
      // 2️⃣ Otherwise → use company image automatically
      logoUrl = company.image || null;
      qrLogoUrl = company.qrImage || null;
    }
    const items = JSON.parse(req.body.items); // ⚠️ IMPORTANT

    const calc = await calculateInvoice(items, company._id);
    const invoiceNumber = await generateInvoiceNumber(company._id);
    const invoice = await Invoice.create({
      company: company._id,
      invoiceNumber,
      logo: logoUrl,
      qrLogo: qrLogoUrl,

      customer: req.body.customer,

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
  // const companyId = await getCompanyId(req.userId);
  const companyId = await getCompanyId(req.userId);
  const invoices = await Invoice.find({ company: companyId }).populate(
    "customer warehouse project",
  );

  res.json(invoices);
};

// ================= UPDATE =================
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { isPaid } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { isPaid },
      { new: true },
    ).populate("customer warehouse project");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
export const deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "company customer items.product warehouse project",
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const html = invoiceTemplate(invoice);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] }); // safer for some environments
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

// export const downloadInvoicePDF = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id)
//       .populate("company customer items.product warehouse project");

//     if (!invoice) return res.status(404).json({ message: "Invoice not found" });

//     // PDF doc
//     const doc = new PDFDocument({ size: "A4", margin: 50 });

//     const filename = `Invoice-${invoice.invoiceNumber}.pdf`;
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//     res.setHeader("Content-Type", "application/pdf");
//     doc.pipe(res);

//     // LAYOUT CONSTANTS
//     const margin = 50;
//     const pageWidth = doc.page.width;
//     const contentWidth = pageWidth - margin * 2;
//     let y = 50;

//     // ================= HEADER =================
//     if (invoice.logo) {
//       const response = await axios.get(invoice.logo, { responseType: "arraybuffer" });
//       const imageBuffer = Buffer.from(response.data, "binary");
//       doc.image(imageBuffer, margin, y, { width: 100 });
//     }

//     doc
//       .fontSize(24)
//       .text("INVOICE", margin, y, { align: "right" })
//       .fontSize(10)
//       .text(`Invoice #: ${invoice.invoiceNumber}`, { align: "right" })
//       .text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, { align: "right" });

//     y += 100;

//     // ================= COMPANY & CUSTOMER INFO =================
//     doc
//       .fontSize(12)
//       .text("From:", margin, y)
//       .font("Helvetica-Bold")
//       .text(invoice.company?.name || "-", margin, y + 15)
//       .font("Helvetica")
//       .text(invoice.company?.address || "-", margin, y + 30);

//     doc
//       .fontSize(12)
//       .text("To:", pageWidth / 2, y)
//       .font("Helvetica-Bold")
//       .text(invoice.customer?.name || "-", pageWidth / 2, y + 15)
//       .font("Helvetica")
//       .text(invoice.customer?.address || "-", pageWidth / 2, y + 30);

//     y += 70;

//     // ================= ITEMS TABLE =================
//     const tableTop = y;
//     const rowHeight = 20;

//     // Table Header
//     doc.font("Helvetica-Bold").fillColor("white");
//     doc.rect(margin, tableTop, contentWidth, rowHeight).fill("#4CAF50"); // green header
//     doc.fillColor("white");

//     const itemColumns = [
//       { label: "Product", key: "name", width: 150 },
//       { label: "Unit", key: "unit", width: 50 },
//       { label: "Qty", key: "quantity", width: 50 },
//       { label: "Price", key: "price", width: 60 },
//       { label: "VAT", key: "vatAmount", width: 50 },
//       { label: "Tax", key: "taxAmount", width: 50 },
//       { label: "Total", key: "total", width: 70 },
//     ];

//     let x = margin;
//     itemColumns.forEach((col) => {
//       doc.text(col.label, x + 2, tableTop + 5);
//       x += col.width;
//     });

//     // Table Rows
//     let rowY = tableTop + rowHeight;
//     invoice.items.forEach((item, i) => {
//       // alternate row color
//       if (i % 2 === 0) {
//         doc.rect(margin, rowY, contentWidth, rowHeight).fill("#f2f2f2").fillColor("black");
//       } else {
//         doc.fillColor("black");
//       }

//       x = margin;
//       itemColumns.forEach((col) => {
//         let text = item[col.key];
//         if (typeof text === "number") text = text.toFixed(2);
//         doc.text(text, x + 2, rowY + 5);
//         x += col.width;
//       });

//       rowY += rowHeight;
//     });

//     y = rowY + 20;

//     // ================= TOTALS =================
//     const totalsX = margin + contentWidth - 150;
//     doc.font("Helvetica-Bold").fillColor("black");

//     doc
//       .text("Subtotal:", totalsX, y)
//       .text(invoice.subtotal.toFixed(2), totalsX + 100, y, { align: "right" });

//     doc
//       .text("VAT:", totalsX, y + 15)
//       .text(invoice.totalVAT.toFixed(2), totalsX + 100, y + 15, { align: "right" });

//     doc
//       .text("Taxes:", totalsX, y + 30)
//       .text(invoice.totalTaxes.toFixed(2), totalsX + 100, y + 30, { align: "right" });

//     doc
//       .text("Timbre Fiscal:", totalsX, y + 45)
//       .text(invoice.timbreFiscal.toFixed(2), totalsX + 100, y + 45, { align: "right" });

//     doc
//       .fontSize(14)
//       .fillColor("#FF5722")
//       .text("Net Pay:", totalsX, y + 70)
//       .text(invoice.netPay.toFixed(2), totalsX + 100, y + 70, { align: "right" })
//       .fillColor("black");

//     // ================= FOOTER =================
//     doc
//       .fontSize(10)
//       .text(invoice.note || "Thank you for your business!", margin, doc.page.height - 50, {
//         align: "center",
//       });

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
