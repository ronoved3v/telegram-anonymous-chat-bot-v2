const User = require("../models/User");

module.exports = (bot) => {
  bot.command("online", async (ctx) => {
    const online = await User.countDocuments({ status: "online" });
    const finding = await User.countDocuments({ status: "finding" });
    const chatting = await User.countDocuments({ status: "chatting" });

    ctx.reply(
      `📱 Online: ${online} người\n🌸 Đang tìm bạn: ${finding} người\n🎯 Đang trò chuyện: ${chatting} người`
    );
  });
};
