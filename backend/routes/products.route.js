import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  importProductsFromExcel
} from "../controllers/products.controller.js";
import uploadExcel from "../middleware/uploadExcel.js";
const router = express.Router();

router.post("/products", verifyToken, createProduct);
router.get("/products", verifyToken, getProducts);
router.put("/products/:id", verifyToken, updateProduct);
router.delete("/products/:id", verifyToken, deleteProduct);

router.post(
  "/products/import",
  verifyToken,
  uploadExcel.single("file"),
  importProductsFromExcel
);

export default router;