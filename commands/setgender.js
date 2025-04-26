const User = require("../models/User");

module.exports = (bot) => {
  bot.command("setgender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Bạn chưa đăng ký. Vui lòng đăng ký trước.");
    }

    const genderOptions = ["male", "female"];

    ctx.reply("Bạn muốn chọn giới tính nào? (Nhập 'male' hoặc 'female')");

    bot.on("text", async (genderCtx) => {
      const gender = genderCtx.message.text.toLowerCase();

      if (!genderOptions.includes(gender)) {
        return genderCtx.reply(
          "Giới tính không hợp lệ. Hãy nhập 'male' hoặc 'female'."
        );
      }

      user.gender = gender;
      await user.save();
      genderCtx.reply(`Giới tính của bạn đã được cập nhật thành ${gender}.`);
    });
  });
};
