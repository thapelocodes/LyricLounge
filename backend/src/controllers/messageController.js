const Message = require("../models/Message");

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
  const sender = req.user._id;
  try {
    const message = new Message({
      chatroomId,
      sender,
      content,
      isSent: true,
    });
    await message.save();

    req.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getChatHistroy, sendMessage };
