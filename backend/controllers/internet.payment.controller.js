import { InternetPayment } from "../models/internet.payment.model.js";
import { InternetClient } from "../models/internet.client.model.js";
import { ContractType } from "../models/contract.type.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import { CompteFinancier } from "../models/compte.financier.model.js";
import puppeteer from "puppeteer";
import { internetPaymentTemplate } from "../templates/internetPaymentTemplate.js";
import { User } from "../models/user.model.js";
import { logAction } from "../utils/auditLogger.js";
// CREATE PAYMENT
// export const createInternetPayment = async (req, res) => {
//   try {
//     const companyId = await getCompanyId(req.userId);

//     const {
//       client,
//       contractType,
//       contractCode,
//       month,
//       year,
//       paidPrice,
//       notes,
//     } = req.body;

//     const existingClient = await InternetClient.findById(client);

//     if (!existingClient) {
//       return res.status(404).json({
//         message: "Client not found",
//       });
//     }

//     const existingContract = await ContractType.findById(contractType);

//     if (!existingContract) {
//       return res.status(404).json({
//         message: "Contract type not found",
//       });
//     }

//     // prevent duplicate month payment
//     const alreadyPaid = await InternetPayment.findOne({
//       client,
//       month,
//       year,
//     });

//     if (alreadyPaid) {
//       return res.status(400).json({
//         message: "This client already paid this month",
//       });
//     }

//     const payment = await InternetPayment.create({
//       company: companyId,
//       client,
//       contractType,
//       contractCode,
//       month,
//       year,
//       paidPrice,
//       notes,
//     });

//     const populated = await payment.populate([
//       "client",
//       "contractType",
//     ]);

//     res.status(201).json(populated);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// CREATE PAYMENT
export const createInternetPayment = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const {
      client,
      contractType,
      contractCode,
      month,
      year,
      paidPrice,
      notes,
    } = req.body;

    const existingClient = await InternetClient.findById(client);
    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const existingContract = await ContractType.findById(contractType);
    if (!existingContract) {
      return res.status(404).json({ message: "Contract type not found" });
    }

    const alreadyPaid = await InternetPayment.findOne({
      client,
      month,
      year,
    });

    if (alreadyPaid) {
      return res.status(400).json({
        message: "This client already paid this month",
      });
    }

    // 1️⃣ CREATE PAYMENT
    const payment = await InternetPayment.create({
      company: companyId,
      client,
      contractType,
      contractCode,
      month,
      year,
      paidPrice,
      notes,
    });

    // 2️⃣ UPDATE FINANCIAL ACCOUNT (🔥 NEW PART)
    const compte = await CompteFinancier.findOne({
      company: companyId,
    });

    if (!compte) {
      return res.status(404).json({
        message: "Financial account not found",
      });
    }

    compte.currentBalance =
      (compte.currentBalance || 0) + Number(paidPrice);

    await compte.save();

    // 3️⃣ populate response
    const populated = await payment.populate([
      "client",
      "contractType",
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET PAYMENTS
export const getInternetPayments = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const payments = await InternetPayment.find({
      company: companyId,
    })
      .populate("client")
      .populate("contractType")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// GET CLIENT HISTORY
export const getClientPaymentHistory = async (req, res) => {
  try {
    const payments = await InternetPayment.find({
      client: req.params.clientId,
    })
      .populate("client")
      .populate("contractType")
      .sort({ year: -1, month: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// DELETE
// export const deleteInternetPayment = async (req, res) => {
//   try {
//     await InternetPayment.findByIdAndDelete(req.params.id);

//     res.json({
//       message: "Payment deleted",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

export const deleteInternetPayment = async (req, res) => {
  try {
    // 1️⃣ Get payment BEFORE delete
    const companyId = await getCompanyId(req.userId); 
    const payment = await InternetPayment.findById(req.params.id)
      .populate("client")
      .populate("contractType");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // 2️⃣ Delete payment
    await InternetPayment.findByIdAndDelete(req.params.id);

    // 3️⃣ Optional but IMPORTANT: reverse financial impact
    const compte = await CompteFinancier.findOne({
      company: payment.company,
    });

    if (compte) {
      compte.currentBalance =
        (compte.currentBalance || 0) - Number(payment.paidPrice);

      await compte.save();
    }

    // 4️⃣ Audit log
    await logAction({
      req,
      user: req.userId,
      companyId: payment.company, 
      action: "DELETE",
      entity: "InternetPayment",
      entityId: payment._id,
      before: payment,
      message: `Internet payment for client ${payment.client?.name || payment.client?._id} deleted`,
    });

    res.json({
      message: "Payment deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};


export const downloadInternetPaymentPDF = async (req, res) => {
  try {
    const payment = await InternetPayment.findById(req.params.id)
      .populate("client")
      .populate("contractType")
      .populate("company");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const html = internetPaymentTemplate(payment);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="InternetPayment-${payment._id}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};