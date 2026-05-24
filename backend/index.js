import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import multer from "multer";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import * as pdfParse from "pdf-parse";
import { stripeWebhook } from "./controllers/payment.controller.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { User } from "./models/user.model.js";
import companyRoutes from "./routes/company.route.js";
import taxRoutes from "./routes/tax.route.js";
import projectsRoutes from "./routes/projects.route.js";
import catalogRoutes from "./routes/catalog.route.js";
import warehouseRoutes from "./routes/warehouse.route.js";
import productRoutes from "./routes/products.route.js";
import customerRoutes from "./routes/customer.route.js";
import invoiceRoutes from "./routes/invoice.route.js";
import clientOrderRoutes from "./routes/client.order.route.js";
import supplierRoutes from "./routes/supplier.route.js";
import suppliersInvoiceRoutes from "./routes/suppliers.invoice.route.js";
import suppliersOrderRoutes from "./routes/supplier.order.route.js";
import planRoutes from "./routes/plancomptable.route.js";
import typeCompteRoutes from "./routes/type.compte.route.js";
import journalComptableRoutes from "./routes/journal.comptable.route.js";
import { seedPlanComptable } from "./utils/seedPlanComptable.js";
import { seedJournalComptable } from "./utils/seedJournalComptable.js";
import compteRoutes from "./routes/compte.financier.route.js";
import workerRoutes from "./routes/worker.routes.js";
import materialsRoutes from "./routes/materials.route.js";
import machineTypeRoutes from "./routes/machine.type.route.js";
import technicalServiceRoutes from "./routes/technical.service.route.js";
import contractTypeRoutes from "./routes/contract.type.route.js";
import internetClientRoutes from "./routes/internet.client.route.js";
import internetPaymentRoutes from "./routes/internet.payment.route.js";
import noteRoutes from "./routes/note.route.js";
const router = express.Router();
const openai = new OpenAI();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook,
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/client-orders", clientOrderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplier-invoices", suppliersInvoiceRoutes);
app.use("/api/supplier-orders", suppliersOrderRoutes);
app.use("/api/plan-comptable", planRoutes);
app.use("/api/type-comptes", typeCompteRoutes);
app.use("/api/journal-comptable", journalComptableRoutes);
app.use("/api/comptes-financiers", compteRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/machine-types", machineTypeRoutes);
app.use("/api/technical-services", technicalServiceRoutes);
app.use("/api/contract-types", contractTypeRoutes);
app.use("/api/internet-clients", internetClientRoutes);
app.use("/api/internet-payments", internetPaymentRoutes);
app.use("/api/notes", noteRoutes);

// index.js

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// ----------------- Production Frontend -----------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

seedPlanComptable();
seedJournalComptable();