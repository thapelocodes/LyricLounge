const express = require("express");
const {
  getChatHistroy,
  sendMessage,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:chatroomId", authMiddleware, getChatHistroy);
router.post("/", authMiddleware, sendMessage);

module.exports = router;
