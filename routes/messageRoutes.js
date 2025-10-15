import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/",  sendMessage);
router.get("/", protect, getMessages);

export default router;