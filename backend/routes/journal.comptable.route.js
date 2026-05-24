import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createJournal, deleteJournal, getJournals, updateJournal } from "../controllers/journal.comptable.controller.js";


const router = express.Router();

router.get("/", verifyToken, getJournals);
router.post("/", verifyToken, createJournal);
router.put("/:id", verifyToken, updateJournal);
router.delete("/:id", verifyToken, deleteJournal);

export default router;