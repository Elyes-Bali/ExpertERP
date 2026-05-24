import { Company } from "../models/company.model.js";
import { Project } from "../models/projects.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// // 🔹 Get company ID from user
// const getCompanyId = async (userId) => {
//   const company = await Company.findOne({ user: userId });
//   return company?._id;
// };


// Create Project
export const createProject = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const project = await Project.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
};

// Get Projects
export const getProjects = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);
    const projects = await Project.find({ company: companyId });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// Toggle Status
export const toggleProjectStatus = async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.isActive = !project.isActive;
  await project.save();
  res.json(project);
};


// Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};