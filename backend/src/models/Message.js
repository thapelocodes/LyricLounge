const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatroom",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false },
    isSent: { type: Boolean, default: false },
    receivedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isReceivedByAll: { type: Boolean, default: false },
    isSeenByAll: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
