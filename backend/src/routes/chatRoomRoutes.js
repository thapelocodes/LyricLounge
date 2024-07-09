const express = require("express");
const {
  createChatRoom,
  fetchChatRooms,
} = require("../controllers/chatRoomController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/chatrooms", authMiddleware, createChatRoom);
router.get("/chatrooms", authMiddleware, fetchChatRooms);

module.exports = router;
