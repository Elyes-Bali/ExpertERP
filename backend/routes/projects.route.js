import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createProject,getProjects, toggleProjectStatus,updateProject,deleteProject} from "../controllers/projects.controller.js";

const router = express.Router();

// PROJECTS
router.post("/projects", verifyToken, createProject);
router.get("/projects", verifyToken, getProjects);
router.put("/projects/:id/toggle", verifyToken, toggleProjectStatus);

router.put("/projects/:id", verifyToken, updateProject);
router.delete("/projects/:id", verifyToken, deleteProject);

export default router;