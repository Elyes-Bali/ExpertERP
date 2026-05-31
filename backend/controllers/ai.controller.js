// import { geminiModel } from "../services/gemini.service.js";
// import { ClientOrder } from "../models/client.oder.model.js";
// import { SOrder } from "../models/supplier.order.model.js";
// import { Invoice } from "../models/invoice.model.js";
// import { SInvoice } from "../models/supplier.invoice.model.js";
// import { getCompanyId } from "../utils/getCompanyId.js";

// export const generateBusinessInsights = async (req, res) => {
//   try {
//     const companyId = await getCompanyId(req.userId);

//     const clientOrders = await ClientOrder.find({
//       company: companyId,
//       isPaid: true,
//       isCanceled: false,
//     });

//     const supplierOrders = await SOrder.find({
//       company: companyId,
//       isPaid: true,
//     });

//     const invoices = await Invoice.find({
//       company: companyId,
//       isPaid: true,
//     });

//     const supplierInvoices = await SInvoice.find({
//       company: companyId,
//       isPaid: true,
//     });

//     const revenue =
//       [...clientOrders, ...invoices].reduce(
//         (acc, item) => acc + (item.netPay || 0),
//         0
//       );

//     const purchases =
//       [...supplierOrders, ...supplierInvoices].reduce(
//         (acc, item) => acc + (item.netPay || 0),
//         0
//       );

//     const profit = revenue - purchases;

//     const monthlySales = {};

//     [...clientOrders, ...invoices].forEach((item) => {
//       const month = new Date(item.date).toLocaleString("fr-FR", {
//         month: "short",
//       });

//       if (!monthlySales[month]) {
//         monthlySales[month] = 0;
//       }

//       monthlySales[month] += item.netPay || 0;
//     });

//   const prompt = `
// Tu es un analyste financier ERP expert.

// Retourne UNIQUEMENT un JSON valide avec cette structure :

// {
//   "summary": {
//     "title": "",
//     "points": ["", "", ""]
//   },
//   "risks": [
//     { "title": "", "severity": "high|medium|low", "description": "" }
//   ],
//   "opportunities": [
//     { "title": "", "description": "" }
//   ],
//   "forecast": [
//     { "month": "Juin", "value": 0 }
//   ],
//   "recommendations": [
//     { "title": "", "action": "" }
//   ]
// }

// Données:
// Revenu: ${revenue}
// Achats: ${purchases}
// Profit: ${profit}

// Ventes mensuelles:
// ${JSON.stringify(monthlySales, null, 2)}

// IMPORTANT:
// - Répond uniquement en JSON
// - Aucun texte autour
// - Français professionnel
// `;

//     const result = await geminiModel.generateContent(prompt);

//     const response = result.response.text();

//     res.json({
//       success: true,
//       insights: response,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };