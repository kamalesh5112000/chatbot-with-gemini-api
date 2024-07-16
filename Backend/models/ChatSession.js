const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: String,
  sender: String,
}, { timestamps: true });

const chatSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  initialMessage: String,
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
