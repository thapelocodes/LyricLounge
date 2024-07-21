const Message = require("../models/Message");
const User = require("../models/User");

const getChatHistroy = async (req, res) => {
  try {
    const messages = await Message.find({
      chatroomId: req.params.chatroomId,
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const sendMessage = async (req, res) => {
  const { chatroomId, content } = req.body;
  const senderId = req.user._id;
  try {
    const user = await User.findById(senderId).select("username");
    const message = new Message({
      chatroomId,
      sender: user.username,
      content,
      isSent: true,
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getChatHistroy, sendMessage };
