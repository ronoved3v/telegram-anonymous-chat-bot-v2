const User = require("../models/User");

module.exports = (bot) => {
  bot.command("points", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user) {
      ctx.reply(`Bạn đang có ${user.points} Point.`);
    } else {
      ctx.reply("Bạn chưa tham gia.");
    }
  });
};
