const express = require("express");
const {
  createChatroom,
  joinChatroom,
  leaveChatroom,
  getChatrooms,
  getUserChatrooms,
} = require("../controllers/chatController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createChatroom)
  .get(authMiddleware, getChatrooms);
router.post("/:chatroomId/join", authMiddleware, joinChatroom);
router.post("/:chatroomId/leave", authMiddleware, leaveChatroom);
router.get("/userChatrooms", authMiddleware, getUserChatrooms);

module.exports = router;
