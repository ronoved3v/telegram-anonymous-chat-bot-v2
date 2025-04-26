const { Telegraf } = require("telegraf");
const connectDB = require("./database");
const User = require("./models/User");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const bot = new Telegraf(process.env.BOT_TOKEN);

connectDB();

// Load tất cả các command từ thư mục commands
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach((file) => {
  if (file.endsWith(".js")) {
    require(path.join(commandsPath, file))(bot); // Load từng file command vào bot
  }
});

bot.on("message", async (ctx) => {
  const telegramId = ctx.from.id;
  const user = await User.findOne({ telegramId });

  if (!user) return; // Nếu không tìm thấy người dùng, không làm gì cả.

  // Chỉ chuyển tiếp nếu người dùng đang trong trạng thái "chatting" và có đối tác
  if (user.status === "chatting" && user.partnerId) {
    try {
      if (ctx.message.text) {
        // Chuyển tiếp tin nhắn văn bản
        await ctx.telegram.sendMessage(user.partnerId, ctx.message.text);
      } else if (ctx.message.sticker) {
        // Chuyển tiếp sticker
        await ctx.telegram.sendSticker(
          user.partnerId,
          ctx.message.sticker.file_id
        );
      } else if (ctx.message.voice) {
        // Chuyển tiếp voice
        await ctx.telegram.sendVoice(user.partnerId, ctx.message.voice.file_id);
      } else if (ctx.message.photo) {
        // Chuyển tiếp ảnh (chọn ảnh có độ phân giải cao nhất)
        const largestPhoto = ctx.message.photo[ctx.message.photo.length - 1];
        await ctx.telegram.sendPhoto(user.partnerId, largestPhoto.file_id);
      }

      // Cập nhật điểm sau mỗi tin nhắn gửi đi
      user.points += 1;
      await user.save();
    } catch (error) {
      console.error("Error forwarding message:", error);
    }
  }
});

bot.launch();
console.log("Bot is running...");
