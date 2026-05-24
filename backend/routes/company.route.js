import express from "express";
import { upsertCompany, getMyCompany } from "../controllers/company.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadCompanyFiles } from "../middleware/multerCompany.js"; // ✅ named import

const router = express.Router();

router.post(
  "/",
  verifyToken,
  uploadCompanyFiles, // ✅ use fields() middleware
  upsertCompany
);

router.get("/", verifyToken, getMyCompany);

export default router;