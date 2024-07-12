const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");

const createChatRoom = async (req, res) => {
  const { name, description } = req.body;
  try {
    const chatRoom = await ChatRoom.create({
      name,
      description,
      creator: req.user._id,
      users: [req.user._id],
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { chatRooms: chatRoom._id },
    });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    console.log(`Chat Rooms Retrieved: ${chatRooms.length}`);
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms" });
  }
};

const fetchChatRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("chatRooms");
    res.status(200).json(user.chatRooms);
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

const searchChatRooms = async (req, res) => {
  try {
    const { query } = req.query.query;
    const chatRooms = await ChatRoom.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinChatRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    if (chatRoom.users.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: `You're already a member of ${chatRoom.name}` });
    }
    chatRoom.users.push(req.user._id);
    await chatRoom.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { chatRooms: chatRoom._id },
    });
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const leaveChatRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    chatRoom.users = chatRoom.users.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await chatRoom.save();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { chatRooms: chatRoom._id },
    });
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChatRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    if (chatRoom.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await chatRoom.remove();
    await Message.deleteMany({ chatRoom: _id });
    await User.updateMany(
      { chatRooms: chatRoom._id },
      { $pull: { chatRooms: chatRoom._id } }
    );
    res.json({ message: "Chat room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChatRoom,
  getAllChatRooms,
  fetchChatRooms,
  fetchChatRoomMessages,
  searchChatRooms,
  joinChatRoom,
  leaveChatRoom,
  deleteChatRoom,
};
