const Message = require("../models/Message");
const User = require("../models/User");

const markMessagesAsReceived = async (messageIds, userId) => {
  try {
    for (const messageId of messageIds) {
      const message = await Message.findById(messageId);

      if (!message) {
        console.error(`Message with ID ${messageId} not found.`);
        continue;
      }

      // Check if the userId is already in receivedBy
      if (message.receivedBy.includes(userId)) {
        console.log(`User ${userId} has already received this message.`);
        continue;
      }

      message.receivedBy.push(userId);
      await message.save();
    }
  } catch (error) {
    console.error("Error in markMessagesAsReceived:", error);
  }
};

const markMessagesAsSeen = async (userId, chatroomId) => {
  const messages = await Message.find({
    chatroomId,
    // receivedBy: userId,
    seenBy: { $ne: userId },
  });

  for (const message of messages) {
    message.seenBy.push(userId);
    await message.save();
  }
};

const getChatHistroy = async (req, res) => {
  try {
    await markMessagesAsSeen(req.user._id, req.params.chatroomId);
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
    const messageToSend = {
      chatroomId,
      sender: user.username,
      content,
      timestamp: new Date(),
      isSennt: true,
      receivedBy: [],
      seenBy: [],
    };

    res.status(201).json(messageToSend);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  markMessagesAsReceived,
  getChatHistroy,
  sendMessage,
};
