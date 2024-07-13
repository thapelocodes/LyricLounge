const Chatroom = require("../models/Chatroom");
const User = require("../models/User");

const createChatroom = async (req, res) => {
  const { name, description } = req.body;
  const chatroom = new Chatroom({
    name,
    description,
    creator: req.user._id || null,
    users: req.user._id ? [req.user._id] : [],
  });
  await chatroom.save();
  if (chatroom.creator) {
    req.user.chatrooms.push(chatroom._id);
    await req.user.save();
  }
  res.status(201).json(chatroom);
};

const joinChatroom = async (req, res) => {
  const { chatroomId } = req.params;
  const chatroom = await Chatroom.findById(chatroomId);
  const user = await User.findById(req.user._id);
  if (
    !chatroom.users.includes(req.user._id) &&
    !user.chatrooms.includes(chatroomId)
  ) {
    chatroom.users.push(user._id);
    await chatroom.save();
    user.chatrooms.push(chatroomId);
    await user.save();
  }
  res.status(200).json(chatroom);
};

const leaveChatroom = async (req, res) => {
  const { chatroomId } = req.params;
  const chatroom = await Chatroom.findById(chatroomId);
  const user = await User.findById(req.user._id);
  chatroom.users.pull(user._id);
  await chatroom.save();
  user.chatrooms.pull(chatroomId);
  await user.save();
  res.status(200).json(chatroom);
};

const getChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find();
  res.status(200).json(chatrooms);
};

const getUserChatrooms = async (req, res) => {
  const user = await User.findById(req.user._id).populate("chatrooms");
  res.status(200).json(user.chatrooms);
};

module.exports = {
  createChatroom,
  joinChatroom,
  leaveChatroom,
  getChatrooms,
  getUserChatrooms,
};
