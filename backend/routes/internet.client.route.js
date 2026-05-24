import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createInternetClient, deleteInternetClient, getInternetClients, updateInternetClient } from "../controllers/internet.client.controller.js";


const router = express.Router();

router.post("/internet-clients", verifyToken, createInternetClient);
router.get("/internet-clients", verifyToken, getInternetClients);
router.put("/internet-clients/:id", verifyToken, updateInternetClient);
router.delete("/internet-clients/:id", verifyToken, deleteInternetClient);

export default router;