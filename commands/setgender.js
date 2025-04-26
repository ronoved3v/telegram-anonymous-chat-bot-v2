const { Markup } = require("telegraf");
const User = require("../models/User");

module.exports = (bot) => {
  bot.command("setgender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply(
        "Bạn chưa đăng ký. Vui lòng sử dụng /start để đăng ký trước."
      );
    }

    // Nếu người dùng đã chọn giới tính rồi thì không cần phải chọn lại
    if (user.gender !== "unknown") {
      return ctx.reply(`Bạn đã chọn giới tính: ${user.gender}.`);
    }

    // Gửi inline keyboard với lựa chọn giới tính
    const maleButton = Markup.button.callback("Nam", "male");
    const femaleButton = Markup.button.callback("Nữ", "female");

    const keyboard = Markup.inlineKeyboard([maleButton, femaleButton]);

    return ctx.reply("Hãy chọn giới tính của bạn:", keyboard);
  });

  // Xử lý khi người dùng chọn giới tính là Nam
  bot.action("male", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Bạn chưa đăng ký. Vui lòng sử dụng /start để đăng ký.");
    }

    // Cập nhật giới tính của người dùng
    user.gender = "male";
    await user.save();

    return ctx.reply("Giới tính của bạn đã được cập nhật thành Nam.");
  });

  // Xử lý khi người dùng chọn giới tính là Nữ
  bot.action("female", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Bạn chưa đăng ký. Vui lòng sử dụng /start để đăng ký.");
    }

    // Cập nhật giới tính của người dùng
    user.gender = "female";
    await user.save();

    return ctx.reply("Giới tính của bạn đã được cập nhật thành Nữ.");
  });
};
