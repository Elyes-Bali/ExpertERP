import { TechnicalService } from "../models/technical.service.model.js";
import { Material } from "../models/materials.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";
import puppeteer from "puppeteer";
import { technicalServiceTemplate } from "../templates/technicalServiceTemplate.js";
import { CompteFinancier } from "../models/compte.financier.model.js";
import { Note } from "../models/note.model.js";
// CREATE
export const createTechnicalService = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    let materialsPrice = 0;

    for (const item of req.body.materials) {
      const material = await Material.findById(item.material);

      if (!material) {
        return res.status(404).json({
          message: "Material not found",
        });
      }

      if (material.quantity < item.quantityUsed) {
        return res.status(400).json({
          message: `Not enough quantity for ${material.name}`,
        });
      }

      material.quantity -= item.quantityUsed;
      await material.save();

      item.price = material.price * item.quantityUsed;

      materialsPrice += item.price;
    }

    const finalPrice =
      Number(req.body.workforcePrice) + Number(materialsPrice);

    const service = await TechnicalService.create({
      ...req.body,
      company: companyId,
      materialsPrice,
      finalPrice,
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET
export const getTechnicalServices = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const services = await TechnicalService.find({
      company: companyId,
    })
      .populate("machineType")
      .populate("materials.material");

    res.json(services);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateTechnicalService = async (req, res) => {
  try {
    const service = await TechnicalService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let materialsPrice = 0;

    // 1. restore old stock
    for (const oldItem of service.materials) {
      const material = await Material.findById(oldItem.material);
      if (material) {
        material.quantity += oldItem.quantityUsed;
        await material.save();
      }
    }

    // 2. recalculate materials
    const materialsToUse = req.body.materials || service.materials;

    for (const item of materialsToUse) {
      const material = await Material.findById(item.material);

      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }

      if (material.quantity < item.quantityUsed) {
        return res.status(400).json({
          message: `Not enough quantity for ${material.name}`,
        });
      }

      material.quantity -= item.quantityUsed;
      await material.save();

      materialsPrice += material.price * item.quantityUsed;
    }

    // 3. 👇 PUT IT HERE (AFTER materials calculation)
    const workforce =
      req.body.workforcePrice ?? service.workforcePrice;

    const finalPrice =
      Number(workforce) + Number(materialsPrice);

    // 4. save updated service
    const updated = await TechnicalService.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        materialsPrice,
        finalPrice,
      },
      { new: true }
    )
      .populate("machineType")
      .populate("materials.material");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteTechnicalService = async (req, res) => {
  try {
    await TechnicalService.findByIdAndDelete(req.params.id);

    res.json({
      message: "Technical service deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


export const markAsPaid = async (req, res) => {
  try {
    const service = await TechnicalService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 🚨 prevent double payment
    if (service.paidStatus === "paid") {
      return res.status(400).json({ message: "Service already paid" });
    }

    service.paidStatus = "paid";
    service.paymentDate = new Date();

    const savedService = await service.save();

    // 🔥 ADD MONEY TO FINANCIAL ACCOUNT
    const compte = await CompteFinancier.findOne({
      company: service.company,
    });

    if (!compte) {
      return res.status(404).json({
        message: "Financial account not found",
      });
    }

    compte.currentBalance =
      (compte.currentBalance || 0) + (service.finalPrice || 0);

    await compte.save();

    const populated = await savedService.populate("machineType");

    return res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// export const downloadTechnicalServicePDF = async (req, res) => {
//   try {
//     const service = await TechnicalService.findById(req.params.id)
//       .populate("machineType")
//       .populate("materials.material")
//       .populate("company");

//     if (!service)
//       return res.status(404).json({ message: "Service not found" });

//     const html = technicalServiceTemplate(service);

//     const browser = await puppeteer.launch({
//       args: ["--no-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="TechnicalService-${service._id}.pdf"`,
//       "Content-Length": pdfBuffer.length,
//     });

//     res.end(pdfBuffer);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const downloadTechnicalServicePDF = async (req, res) => {
  try {
    const service = await TechnicalService.findById(req.params.id)
      .populate("machineType")
      .populate("materials.material")
      .populate("company");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // 🔥 GET COMPANY NOTE
    const note = await Note.findOne({
      company: service.company._id,
    }).sort({ createdAt: -1 });

    // 🔥 PASS NOTE TO TEMPLATE
    const html = technicalServiceTemplate(
      service,
      note?.notes || ""
    );

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="TechnicalService-${service._id}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};