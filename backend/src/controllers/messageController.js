const Message = require("../models/Message");
const User = require("../models/User");

const markMessageAsReceived = async (messageId, userId) => {
  try {
    await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { receivedBy: userId } },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
};

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
    const message = new Message({
      chatroomId,
      sender: user.username,
      content,
      isSent: true,
      receivedBy: [],
      seenBy: [],
    });
    message.messageId = message._id;
    console.log("Message ID:", message.messageId);
    await message.save();

    console.log("Message sent:", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  markMessageAsReceived,
  markMessagesAsReceived,
  getChatHistroy,
  sendMessage,
};
