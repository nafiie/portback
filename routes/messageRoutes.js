import express from "express";
import { sendMessage, getMessages, deleteMessage} from "../controllers/messageController.js";

const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/",  sendMessage);
router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);

export default router;