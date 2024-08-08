const express = require("express");
const {
  getChatHistroy,
  sendMessage,
  markMessagesAsSeenFromSocket,
  getMessagesByMembership,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:chatroomId", authMiddleware, getChatHistroy);
router.post("/", authMiddleware, sendMessage);
router.put(
  "/:chatroomId/mark-seen",
  // authMiddleware,
  markMessagesAsSeenFromSocket
);
router.get("/", authMiddleware, getMessagesByMembership);

module.exports = router;
