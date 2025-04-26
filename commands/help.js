const User = require("../models/User");

module.exports = (bot) => {
  bot.command("help", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Câu trả lời gợi ý lệnh cho người dùng
    let response = "Chào bạn! Dưới đây là các lệnh mà bạn có thể sử dụng:\n\n";
    response += "/find - Tìm bạn mới để trò chuyện.\n";
    response += "/stop - Dừng cuộc trò chuyện hiện tại.\n";
    response += "/cancel - Dừng tìm kiếm bạn.\n";
    response += "/online - Xem ai đang online.\n";
    response += "/checkin - Điểm danh hàng ngày để nhận thưởng.\n";
    response += "/points - Kiểm tra số điểm bạn đang có.\n";

    // Nếu người dùng đang trò chuyện, gợi ý một số lệnh bổ sung
    if (user && user.status === "chatting") {
      response +=
        "\nBạn đang trò chuyện với đối tác. Sử dụng lệnh /stop để kết thúc.";
    }

    ctx.reply(response);
  });
};
