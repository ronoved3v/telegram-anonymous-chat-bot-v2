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

    // Kiểm tra xem người dùng có đủ điểm hay không
    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ điểm để tìm bạn. Cần 5 điểm mỗi lượt tìm."
      );
    }

    // Yêu cầu người dùng chọn giới tính muốn tìm
    const genderOptions = ["male", "female"];
    const genderMessage = `Bạn muốn tìm bạn là giới tính nào? (Nhập 'male' hoặc 'female')`;

    ctx.reply(genderMessage);

    bot.on("text", async (genderCtx) => {
      const searchGender = genderCtx.message.text.toLowerCase();

      if (!genderOptions.includes(searchGender)) {
        return genderCtx.reply(
          "Giới tính không hợp lệ. Hãy nhập 'male' hoặc 'female'."
        );
      }

      // Trừ điểm của người dùng
      user.points -= 5;
      await user.save();

      // Tìm đối tác phù hợp
      const partner = await User.findOne({
        status: "waiting",
        gender: { $ne: user.gender, $eq: searchGender },
        telegramId: { $ne: telegramId },
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
  });
};
