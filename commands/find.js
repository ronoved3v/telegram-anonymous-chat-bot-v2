const User = require("../models/User");

module.exports = (bot) => {
  bot.command("find", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user || user.gender === "unknown") {
      return ctx.reply(
        "Bạn cần nhập giới tính trước khi tìm bạn. Sử dụng /setgender để chọn giới tính của bạn."
      );
    }

    // Kiểm tra xem người dùng có đủ điểm không
    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ điểm để tìm bạn. Cần 5 điểm mỗi lượt tìm."
      );
    }

    // Cập nhật trạng thái của người dùng khi bắt đầu tìm kiếm
    user.status = "finding";
    await user.save();

    // Tìm đối tác với giới tính không trùng lặp và đang ở trạng thái 'online'
    const partner = await User.findOne({
      status: "online", // tìm người đang online
      gender: { $ne: user.gender }, // tìm người giới tính khác
      telegramId: { $ne: telegramId }, // loại trừ chính người tìm
    });

    if (partner) {
      user.status = "chatting";
      user.partnerId = partner.telegramId;
      partner.status = "chatting";
      partner.partnerId = telegramId;

      await user.save();
      await partner.save();

      // Thông báo cho đối tác
      ctx.telegram.sendMessage(
        partner.telegramId,
        "Đã ghép đôi! Bắt đầu trò chuyện đi nhé~"
      );
      ctx.reply("Đã ghép đôi! Chúc bạn trò chuyện vui vẻ.");
    } else {
      ctx.reply("Đang tìm người phù hợp... Vui lòng đợi nhé~");
    }
  });
};
