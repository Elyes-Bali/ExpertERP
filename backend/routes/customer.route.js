import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/customers", verifyToken, createCustomer);
router.get("/customers", verifyToken, getCustomers);
router.put("/customers/:id", verifyToken, updateCustomer);
router.delete("/customers/:id", verifyToken, deleteCustomer);

export default router;