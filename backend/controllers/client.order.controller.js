import { ClientOrder } from "../models/client.oder.model.js";
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
import { clientOrderTemplate } from "../templates/clientOrderTemplate.js";
import { Transaction } from "../models/transaction.model.js";
import { CompteFinancier } from "../models/compte.financier.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { User } from "../models/user.model.js";
// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

const calculateClientOrder = async (items, companyId) => {
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
    product.stock -= item.quantity;
    product.inStock = product.stock > 0;
    await product.save();
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

const generateClientOrderNumber = async (companyId) => {
  const year = new Date().getFullYear();

  const count = await ClientOrder.countDocuments({
    company: companyId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");

  return `ORD-${year}-${nextNumber}`;
};


export const createClientOrder = async (req, res) => {
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
          { folder: "order_logos" },
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

        if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "order_logos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      qrLogoUrl = uploadResult.secure_url;
    } else {
      // 2️⃣ Otherwise → use company image automatically
      qrLogoUrl = company.qrImage || null;
    }


    const items = JSON.parse(req.body.items); // ⚠️ IMPORTANT

    const calc = await calculateClientOrder(items, company._id);
    const orderNumber = await generateClientOrderNumber(company._id);
    const order = await ClientOrder.create({
      company: company._id,
      orderNumber,
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
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ================= GET =================
export const getClientOrders = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const orders = await ClientOrder.find({ company: companyId }).populate(
    "customer warehouse project",
  );

  res.json(orders);
};


// ================= UPDATE =================

// export const updateClientOrderStatus = async (req, res) => {
//   try {
//     const { isPaid } = req.body;

//     const order = await ClientOrder.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Client order not found" });
//     }

//     // 🔥 detect transition
//     const wasPaid = order.isPaid;

//     // update status
//     order.isPaid = isPaid;
//     await order.save();

//     // 🔥 get compte once (reuse it)
//     const compte = await CompteFinancier.findOne({
//       company: order.company,
//     });

//     if (!compte) {
//       return res.status(400).json({ message: "No financial account found" });
//     }

//     // ✅ CASE 1: NOT PAID → PAID (money IN)
//     if (!wasPaid && isPaid) {
//       // update balance
//       compte.currentBalance += order.netPay;
//       await compte.save();

//       // transaction history
//       await Transaction.create({
//         company: order.company,
//         compte: compte._id,
//         type: "IN",
//         amount: order.netPay,
//         source: "ClientOrder",
//         sourceId: order._id,
//         description: `Payment received for order ${order.orderNumber}`,
//       });
//     }

//     // ✅ CASE 2: PAID → NOT PAID (reverse = money OUT)
//     if (wasPaid && !isPaid) {
//       compte.currentBalance -= order.netPay;
//       await compte.save();

//       await Transaction.create({
//         company: order.company,
//         compte: compte._id,
//         type: "OUT",
//         amount: order.netPay,
//         source: "ClientOrder",
//         sourceId: order._id,
//         description: `Payment reversed for order ${order.orderNumber}`,
//       });
//     }

//     const populatedOrder = await ClientOrder.findById(order._id).populate(
//       "customer warehouse project"
//     );

//     res.json(populatedOrder);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const updateClientOrderStatus = async (req, res) => {
  try {
    const { isPaid, isCanceled } = req.body;

    const order = await ClientOrder.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Client order not found" });
    }

    const wasPaid = order.isPaid;
    const wasCanceled = order.isCanceled;

    // ❌ BLOCK payment if canceled
    if (isPaid && order.isCanceled) {
      return res.status(400).json({
        message: "Cannot pay a canceled order",
      });
    }

    // =====================================
    // 🔥 STEP 1: HANDLE CANCEL / UNCANCEL
    // =====================================

    if (!wasCanceled && isCanceled) {
      // ✅ CANCEL → return stock
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (!product) continue;

        product.stock += item.quantity;
        product.inStock = product.stock > 0;

        await product.save();
      }
    }

    if (wasCanceled && !isCanceled) {
      // 🔄 UNCANCEL → remove stock again
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (!product) continue;

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock to restore order for ${product.name}`,
          });
        }

        product.stock -= item.quantity;
        product.inStock = product.stock > 0;

        await product.save();
      }
    }

    // =====================================
    // 🔥 STEP 2: HANDLE PAYMENT (WITH CANCEL CHECK)
    // =====================================

    const compte = await CompteFinancier.findOne({
      company: order.company,
    });

    if (!compte) {
      return res.status(400).json({ message: "No financial account found" });
    }

    // ✅ NOT PAID → PAID
    if (!wasPaid && isPaid && !order.isCanceled) {
      compte.currentBalance += order.netPay;
      await compte.save();

      await Transaction.create({
        company: order.company,
        compte: compte._id,
        type: "IN",
        amount: order.netPay,
        source: "ClientOrder",
        sourceId: order._id,
        description: `Payment received for order ${order.orderNumber}`,
      });
    }

    // 🔄 PAID → NOT PAID
    if (wasPaid && !isPaid) {
      compte.currentBalance -= order.netPay;
      await compte.save();

      await Transaction.create({
        company: order.company,
        compte: compte._id,
        type: "OUT",
        amount: order.netPay,
        source: "ClientOrder",
        sourceId: order._id,
        description: `Payment reversed for order ${order.orderNumber}`,
      });
    }

    // ❗ EXTRA: If cancel AFTER paid → auto reverse
    if (!wasCanceled && isCanceled && wasPaid) {
      compte.currentBalance -= order.netPay;
      await compte.save();

      await Transaction.create({
        company: order.company,
        compte: compte._id,
        type: "OUT",
        amount: order.netPay,
        source: "ClientOrder",
        sourceId: order._id,
        description: `Order canceled (auto refund) ${order.orderNumber}`,
      });

      order.isPaid = false; // 🔥 force unpaid
    }

    // =====================================
    // 🔄 UPDATE STATES
    // =====================================

    if (typeof isPaid !== "undefined") order.isPaid = isPaid;
    if (typeof isCanceled !== "undefined") order.isCanceled = isCanceled;

    await order.save();

    const updatedOrder = await ClientOrder.findById(order._id).populate(
      "customer warehouse project"
    );

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
export const deleteClientOrder = async (req, res) => {
  await ClientOrder.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const downloadClientOrderPDF = async (req, res) => {
  try {
    const order = await ClientOrder.findById(req.params.id).populate(
      "company customer items.product warehouse project",
    );

    if (!order) return res.status(404).json({ message: "Client order not found" });

    const html = clientOrderTemplate(order);

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
      "Content-Disposition": `attachment; filename="Order-${order.orderNumber}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    // send the raw buffer
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

