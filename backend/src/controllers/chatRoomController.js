const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const createChatRoom = async (req, res) => {
  const { name, userIds } = req.body;
  try {
    const chatRoom = await ChatRoom.create({ name, userIds });
    res.status(201).json({ chatRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchChatRooms = async (req, res) => {
  try {
    const chatrooms = await ChatRoom.find({ userIds: req.user._id });
    res.json({ chatrooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchChatRoomMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ chatRoomId: id }).populate(
      "sender",
      "username"
    );
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createChatRoom, fetchChatRooms, fetchChatRoomMessages };
