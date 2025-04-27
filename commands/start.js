const User = require("../models/User");

module.exports = (bot) => {
  bot.command("start", async (ctx) => {
    const telegramId = ctx.from.id;
    let user = await User.findOne({ telegramId });

    if (!user) {
      // Tạo người dùng mới khi chưa đăng ký
      user = new User({
        telegramId: ctx.from.id,
        username: ctx.from.username || "",
        status: "online",
        partnerId: null,
        gender: "unknown",
        points: 0,
      });
      await user.save();
      ctx.reply(
        "Chào mừng bạn đến với bot! Vui lòng sử dụng /setgender để chọn giới tính của bạn."
      );
    } else {
      if (user.gender === "unknown") {
        ctx.reply(
          "Bạn chưa chọn giới tính. Hãy sử dụng /setgender để cập nhật giới tính của bạn."
        );
      } else {
        ctx.reply(
          `Chào ${user.username}! Bạn đã chọn giới tính: ${user.gender}.`
        );
      }
    }
  });
};
