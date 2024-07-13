const mongoose = require("mongoose");

const chatroomschema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isTyping: { type: Boolean, default: false },
});

const Chatroom = mongoose.model("Chatroom", chatroomschema);
module.exports = Chatroom;
