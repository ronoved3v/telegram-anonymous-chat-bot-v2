const User = require("../models/User");

module.exports = (bot) => {
  bot.command("stop", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Bạn chưa đăng ký thông tin người dùng.");
    }

    // Nếu người dùng đang tìm bạn (finding)
    if (user.status === "finding") {
      return ctx.reply(
        "Bạn đang tìm bạn. Hãy sử dụng lệnh /cancel để dừng tìm kiếm trước khi thoát khỏi cuộc trò chuyện."
      );
    }

    // Nếu người dùng đang online
    if (user.status === "online") {
      return ctx.reply(
        "Bạn đang ở trạng thái online. Bạn chưa tham gia cuộc trò chuyện nào."
      );
    }

    // Nếu người dùng có đối tác
    if (user.partnerId) {
      const partner = await User.findOne({ telegramId: user.partnerId });
      if (partner) {
        partner.status = "online"; // Đặt lại trạng thái của đối tác
        partner.partnerId = null; // Xóa đối tác
        await partner.save();

        // Gửi thông báo cho đối tác
        await ctx.telegram.sendMessage(
          partner.telegramId,
          "Đối phương đã rời khỏi cuộc trò chuyện. Bạn đang ở trạng thái online."
        );
      }
    }

    // Cập nhật trạng thái người dùng
    user.status = "online"; // Đặt lại trạng thái của người dùng
    user.partnerId = null; // Xóa đối tác
    await user.save();

    // Thông báo cho người dùng
    ctx.reply("Bạn đã rời khỏi cuộc trò chuyện và đang ở trạng thái online.");
  });
};
