import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // <-- Cloudinary multer middleware

const router = express.Router();

// --- Routes ---
router.get("/", getProjects);
router.get("/:id", getProjectById);

// ✅ Create project with Cloudinary image upload
router.post("/", protect, upload.single("image"), createProject);

// ✅ Update project with optional new image
router.put("/:id", protect, upload.single("image"), updateProject);

// ✅ Delete project
router.delete("/:id", protect, deleteProject);

export default router;
