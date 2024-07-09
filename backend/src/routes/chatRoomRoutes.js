const express = require("express");
const {
  createChatRoom,
  fetchChatRooms,
  fetchChatRoomMessages,
} = require("../controllers/Controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createChatRoom);
router.get("/", authMiddleware, fetchChatRooms);
router.get("/:id/messages", authMiddleware, fetchChatRoomMessages);

module.exports = router;
