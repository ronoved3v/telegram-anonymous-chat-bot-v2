const { Markup } = require("telegraf");
const User = require("../models/User");

module.exports = (bot) => {
  bot.command("setgender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Nếu người dùng đã có giới tính
    if (user.gender !== "unknown") {
      return ctx.reply("Bạn đã chọn giới tính rồi!");
    }

    // Hiển thị lựa chọn giới tính
    const maleButton = Markup.button.callback("Nam", "male");
    const femaleButton = Markup.button.callback("Nữ", "female");

    const keyboard = Markup.inlineKeyboard([maleButton, femaleButton]);

    return ctx.reply("Chọn giới tính của bạn:", keyboard);
  });

  // Lưu giới tính người dùng
  bot.action("male", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    user.gender = "male";
    await user.save();

    ctx.reply("Bạn đã chọn giới tính Nam.");
  });

  bot.action("female", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    user.gender = "female";
    await user.save();

    ctx.reply("Bạn đã chọn giới tính Nữ.");
  });
};
