const express = require("express");
const {
  createChatRoom,
  fetchChatRooms,
  fetchChatRoomMessages,
  searchChatRooms,
  joinChatRoom,
  leaveChatRoom,
  deleteChatRoom,
  getAllChatRooms,
} = require("../controllers/chatRoomController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createChatRoom);
router.get("/", authMiddleware, getAllChatRooms);
router.get("/all", getAllChatRooms);
router.get("/my-chatrooms", authMiddleware, fetchChatRooms);
router.get("/:id/messages", authMiddleware, fetchChatRoomMessages);
router.get("/search", authMiddleware, searchChatRooms);
router.post("/:id/join", authMiddleware, joinChatRoom);
router.post("/:id/leave", authMiddleware, leaveChatRoom);
router.delete("/:id", authMiddleware, deleteChatRoom);

module.exports = router;
