import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/note.controller.js";


const router = express.Router();

// NOTES
router.post("/notes", verifyToken, createNote);
router.get("/notes", verifyToken, getNotes);
router.put("/notes/:id", verifyToken, updateNote);
router.delete("/notes/:id", verifyToken, deleteNote);

export default router;