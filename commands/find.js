const User = require("../models/User");

module.exports = (bot) => {
  bot.command("find", async (ctx) => {
    const telegramId = ctx.from.id;
    let user = await User.findOne({ telegramId });

    if (!user || user.gender === "unknown") {
      return ctx.reply("Bạn cần nhập giới tính trước khi tìm bạn.");
    }

    user.status = "finding";
    await user.save(); // Lưu lại trạng thái `finding` mà không đổi `partnerId`

    const partner = await User.findOne({
      status: "waiting",
      gender: { $ne: user.gender },
      telegramId: { $ne: telegramId },
    });

    if (partner) {
      user.status = "chatting";
      user.partnerId = partner.telegramId;
      partner.status = "chatting";
      partner.partnerId = telegramId;

      await user.save();
      await partner.save();

      ctx.telegram.sendMessage(
        partner.telegramId,
        "Đã ghép đôi! Bắt đầu trò chuyện đi nhé~"
      );
      ctx.reply("Đã ghép đôi! Chúc bạn nói chuyện vui vẻ.");
    } else {
      ctx.reply("Đang tìm người phù hợp... Vui lòng đợi nhé~");
    }
  });
};
