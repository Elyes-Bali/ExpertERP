import { SOrder } from "../models/supplier.order.model.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Tax } from "../models/tax.model.js";
import cloudinary from "../config/cloudinary.js";
import puppeteer from "puppeteer";
import { supplierOrderTemplate } from "../templates/supplierOrderTemplate.js";
import { CompteFinancier } from "../models/compte.financier.model.js";
import { Transaction } from "../models/transaction.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { User } from "../models/user.model.js";
import { logAction } from "../utils/auditLogger.js";
// 🔹 Get company
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };

// 🔥 CALCULATION ENGINE


const calculateOrder = async (items, companyId) => {
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

const generateOrderNumber = async (companyId) => {
  const year = new Date().getFullYear();

  const count = await SOrder.countDocuments({
    company: companyId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");

  return `SUP-ORD-${year}-${nextNumber}`;
};

export const createOrder = async (req, res) => {
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

    const calc = await calculateOrder(items, company._id);
    const orderNumber = await generateOrderNumber(company._id);
    const order = await SOrder.create({
      company: company._id,
      orderNumber,
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
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ================= GET =================
export const getOrders = async (req, res) => {
  const companyId = await getCompanyId(req.userId);

  const orders = await SOrder.find({ company: companyId }).populate(
    "supplier warehouse project",
  );

  res.json(orders);
};


// ================= UPDATE =================
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { isPaid } = req.body;

//     const order = await SOrder.findByIdAndUpdate(
//       req.params.id,
//       { isPaid },
//       { new: true }
//     ).populate("supplier warehouse project");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { isPaid } = req.body;

//     const order = await SOrder.findById(req.params.id).populate("items.product");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // ✅ ONLY when confirming delivery (supplier delivered goods)
//     if (isPaid && !order.isPaid) {
//       for (const item of order.items) {
//         const product = await Product.findById(item.product._id);

//         if (!product) continue;

//         // 🔥 ADD STOCK (supplier → warehouse)
//         product.stock += item.quantity;
//         product.inStock = product.stock > 0;

//         await product.save();
//       }
//     }

//     order.isPaid = isPaid;
//     await order.save();

//     const updatedOrder = await order.populate("supplier warehouse project");

//     res.json(updatedOrder);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateOrderStatus = async (req, res) => {
  try {
    const { isPaid } = req.body;

    const order = await SOrder.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const companyId = await getCompanyId(req.userId);

    // 👉 get compte
    const compte = await CompteFinancier.findOne({ company: companyId });

    if (!compte) {
      return res.status(400).json({ message: "No financial account found" });
    }

    // =====================================================
    // ✅ CASE 1: UNPAID → PAID (money OUT)
    // =====================================================
    if (isPaid && !order.isPaid) {

      // 🔹 STOCK INCREASE
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);

        if (!product) continue;

        product.stock += item.quantity;
        product.inStock = product.stock > 0;

        await product.save();
      }

      // 🔹 CHECK BALANCE (optional but recommended)
      if (compte.currentBalance < order.netPay) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // 🔹 SUBTRACT MONEY
      compte.currentBalance -= order.netPay;
      await compte.save();

      // 🔹 SAVE TRANSACTION
      await Transaction.create({
        company: companyId,
        compte: compte._id,
        type: "OUT",
        amount: order.netPay,
        source: "SupplierOrder",
        sourceId: order._id,
        description: `Supplier order payment ${order.orderNumber}`,
      });
    }

    // =====================================================
    // ❗ CASE 2: PAID → UNPAID (ROLLBACK)
    // =====================================================
    if (!isPaid && order.isPaid) {

      // 🔹 OPTIONAL: reverse stock (if you want strict logic)
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);

        if (!product) continue;

        product.stock -= item.quantity;
        product.inStock = product.stock > 0;

        await product.save();
      }

      // 🔹 ADD MONEY BACK
      compte.currentBalance += order.netPay;
      await compte.save();

      // 🔹 SAVE REVERSE TRANSACTION
      await Transaction.create({
        company: companyId,
        compte: compte._id,
        type: "IN",
        amount: order.netPay,
        source: "SupplierOrder",
        sourceId: order._id,
        description: `Rollback supplier order ${order.orderNumber}`,
      });
    }

    // =====================================================
    // 🔄 UPDATE STATUS
    // =====================================================
    order.isPaid = isPaid;
    await order.save();

    const updatedOrder = await order.populate("supplier warehouse project");

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= DELETE =================
// export const deleteOrder = async (req, res) => {
//   await SOrder.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };

export const deleteOrder = async (req, res) => {
  try {
    // 1️⃣ Find first (IMPORTANT)
    const companyId = await getCompanyId(req.userId); 
    const order = await SOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Delete
    await SOrder.findByIdAndDelete(req.params.id);

    // 3️⃣ Audit log
    await logAction({
      req,
      user: req.user, // or req.userId depending on your auth middleware
      companyId,
      action: "DELETE",
      entity: "SupplierOrder",
      entityId: order._id,
      before: order,
      message: `Supplier order ${order.orderNumber} deleted`,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const downloadOrderPDF = async (req, res) => {
  try {
    const order = await SOrder.findById(req.params.id).populate(
      "company supplier items.product warehouse project",
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    const html = supplierOrderTemplate(order);

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

