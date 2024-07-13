const Chatroom = require("../models/Chatroom");
const User = require("../models/User");

const createChatroom = async (req, res) => {
  const { name, description } = req.body;
  const chatroom = new Chatroom({
    name,
    description,
    creator: req.userId || null,
    users: req.userId ? [req.userId] : [],
  });
  await chatroom.save();
  res.status(201).json(chatroom);
};

const joinChatroom = async (req, res) => {
  const { chatroomId } = req.params;
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom.users.includes(req.user._id)) {
    chatroom.users.push(req.user._id);
    await chatroom.save();
  }
};
