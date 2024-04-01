import express from "express";
import { getAllMessages, saveMessage } from "../controllers/messages/index.js"
const router = express.Router();

router.get("/", getAllMessages);
router.post("/add", saveMessage);
// router.patch("/edit", editMessage);
// router.delete("/delete", deleteMessage);

export default router;
