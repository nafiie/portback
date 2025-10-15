import Project from "../models/projectModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("category");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

// ✅ Get a single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("category");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project", error: error.message });
  }
};

// ✅ Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, link, category } = req.body;
    const image = req.file ? req.file.path : null; // Cloudinary file URL

    const newProject = new Project({
      title,
      description,
      link,
      category,
      image,
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, link, category } = req.body;
    const updateData = { title, description, link, category };

    if (req.file) {
      updateData.image = req.file.path; // new image URL from Cloudinary
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProject) return res.status(404).json({ message: "Not found" });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete image from Cloudinary
    if (project.image) {
      const publicId = project.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};
