const User = require("../models/User");

module.exports = (bot) => {
  bot.command("cancel", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Bạn chưa đăng ký.");
    }

    // Chỉ cho phép cancel nếu đang tìm bạn
    if (user.status === "finding") {
      user.status = "online"; // Trạng thái trở lại online
      user.partnerId = null; // Xoá đối tác đã ghép
      await user.save(); // Lưu lại
      ctx.reply("Bạn đã dừng tìm kiếm. 📵");
    } else if (user.status === "chatting") {
      ctx.reply(
        "Bạn đang trò chuyện, hãy dùng /stop để dừng trò chuyện trước nhé. 💬"
      );
    } else {
      ctx.reply("Bạn không trong trạng thái tìm kiếm. 😶‍🌫️");
    }
  });
};
