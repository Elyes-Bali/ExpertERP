import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  // Category
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,

  // Units
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,

  // Brands
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} from "../controllers/catalog.controller.js";

const router = express.Router();

////////////////////////
// CATEGORY
////////////////////////
router.post("/categories", verifyToken, createCategory);
router.get("/categories", verifyToken, getCategories);
router.put("/categories/:id", verifyToken, updateCategory);
router.delete("/categories/:id", verifyToken, deleteCategory);

////////////////////////
// UNITS
////////////////////////
router.get("/units", verifyToken, getUnits);
router.post("/units", verifyToken, createUnit);
router.put("/units/:id", verifyToken, updateUnit);
router.delete("/units/:id", verifyToken, deleteUnit);

////////////////////////
// BRANDS
////////////////////////
router.post("/brands", verifyToken, createBrand);
router.get("/brands", verifyToken, getBrands);
router.put("/brands/:id", verifyToken, updateBrand);
router.delete("/brands/:id", verifyToken, deleteBrand);

export default router;