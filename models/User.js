const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown",
  },
  status: {
    type: String,
    enum: ["online", "finding", "chatting", "waiting"],
    default: "online",
  },
  partnerId: { type: Number, default: null },
  points: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now }, // Ngày tham gia
  isPremium: { type: Boolean, default: false }, // Trạng thái Premium
  premiumExpiresAt: { type: Date, default: null }, // Ngày hết hạn Premium
  isBanned: { type: Boolean, default: false }, // Trạng thái bị ban
  banReason: { type: String, default: "" }, // Lý do bị ban
  banDate: { type: Date, default: null }, // Ngày bị ban
});

const User = mongoose.model("User", userSchema);

module.exports = User;
