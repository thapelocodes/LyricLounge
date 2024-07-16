const express = require("express");
const {
  getChatHistroy,
  sendMessage,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/:chatroomId")
  .get(authMiddleware, getChatHistroy)
  .post(authMiddleware, sendMessage);

module.exports = router;
