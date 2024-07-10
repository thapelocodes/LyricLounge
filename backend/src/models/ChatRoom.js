const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
