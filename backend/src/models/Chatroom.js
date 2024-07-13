const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);
module.exports = Chatroom;
