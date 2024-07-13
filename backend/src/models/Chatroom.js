const mongoose = require("mongoose");

const chatroomschema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creator: {},
});
