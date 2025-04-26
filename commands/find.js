const { Markup } = require("telegraf");
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

    // Kiểm tra điểm của người dùng
    const randomFind = Markup.button.callback("Tìm ngẫu nhiên", "random");
    const genderFind = Markup.button.callback("Tìm theo giới tính", "gender");

    const keyboard = Markup.inlineKeyboard([randomFind, genderFind]);

    return ctx.reply("Chọn phương thức tìm bạn:", keyboard);
  });

  // Xử lý tìm kiếm ngẫu nhiên
  bot.action("random", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "online",
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
      ctx.reply("Đã ghép đôi! Chúc bạn trò chuyện vui vẻ.");
    } else {
      ctx.reply("Đang tìm người phù hợp... Vui lòng đợi nhé~");
    }
  });

  // Xử lý tìm kiếm theo giới tính
  bot.action("gender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Hiển thị các giới tính để người dùng chọn
    const maleButton = Markup.button.callback("Nam", "male");
    const femaleButton = Markup.button.callback("Nữ", "female");

    const keyboard = Markup.inlineKeyboard([maleButton, femaleButton]);

    return ctx.reply("Chọn giới tính đối tác muốn tìm:", keyboard);
  });

  // Xử lý tìm kiếm theo giới tính Nam
  bot.action("male", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.points -= 5; // Giảm 5 điểm khi tìm theo giới tính
    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "online",
      gender: "male", // Tìm người nam
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
      ctx.reply("Đã ghép đôi! Chúc bạn trò chuyện vui vẻ.");
    } else {
      ctx.reply("Không tìm thấy người nam phù hợp. Vui lòng đợi nhé~");
    }
  });

  // Xử lý tìm kiếm theo giới tính Nữ
  bot.action("female", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.points -= 5; // Giảm 5 điểm khi tìm theo giới tính
    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "online",
      gender: "female", // Tìm người nữ
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
      ctx.reply("Đã ghép đôi! Chúc bạn trò chuyện vui vẻ.");
    } else {
      ctx.reply("Không tìm thấy người nữ phù hợp. Vui lòng đợi nhé~");
    }
  });
};
