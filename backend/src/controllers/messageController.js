const Message = require("../models/Message");
const User = require("../models/User");

const markMessagesAsReceived = async (messageIds, userId) => {
  try {
    for (const messageId of messageIds) {
      const message = await Message.findById(messageId);

      if (!message) {
        continue;
      }

      // Check if the userId is already in receivedBy
      if (message.receivedBy.includes(userId)) {
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
    receivedBy: userId,
    seenBy: { $ne: userId },
  });

  for (const message of messages) {
    if (message.seenBy.includes(userId)) continue;
    message.seenBy.push(userId);
    await message.save();
  }
};

const markMessagesAsSeenFromSocket = async (req, res) => {
  try {
    if (!req.body.userId || !req.params.chatroomId)
      throw new Error("Invalid request parameters");

    await markMessagesAsSeen(req.body.userId, req.params.chatroomId);
    const messages = await Message.find({
      chatroomId: req.params.chatroomId,
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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
    res.status(500).json({ message: "Server Error" });
  }
};

const getMessagesByMembership = async (req, res) => {
  try {
    const messagesByChatroom = {};
    for (const chatroomId of req.user.chatrooms) {
      const messages = await Message.find({ chatroomId }).sort({
        timestamp: 1,
      });
      messagesByChatroom[chatroomId] = messages;
    }
    res.status(200).json({ messagesByChatroom, userId: req.user._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const sendMessage = async (req, res) => {
  const { chatroomId, content } = req.body;
  const senderId = req.user._id;
  try {
    await markMessagesAsSeen(senderId, chatroomId);
    const user = await User.findById(senderId).select("username");
    const messageToSend = {
      chatroomId,
      sender: user.username,
      content,
      timestamp: new Date(),
      isSennt: true,
      receivedBy: [senderId],
      seenBy: [senderId],
    };

    res.status(201).json(messageToSend);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  markMessagesAsReceived,
  markMessagesAsSeenFromSocket,
  getChatHistroy,
  getMessagesByMembership,
  sendMessage,
};
