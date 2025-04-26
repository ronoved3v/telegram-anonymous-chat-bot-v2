const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  partnerId: { type: Number, default: null },
  status: {
    type: String,
    enum: ["online", "finding", "chatting"],
    default: "online",
  },
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown",
  },
  points: { type: Number, default: 0 },
  lastCheckIn: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
