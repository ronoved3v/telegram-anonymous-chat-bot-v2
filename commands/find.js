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

    if (user.status === "finding") {
      return ctx.reply(
        "Bạn đang trong quá trình tìm bạn. Vui lòng đợi kết quả trước khi tìm tiếp."
      );
    }

    const randomFind = Markup.button.callback("Tìm ngẫu nhiên", "random");
    const genderFind = Markup.button.callback("Tìm theo giới tính", "gender");

    const keyboard = Markup.inlineKeyboard([randomFind, genderFind]);

    return ctx.reply("Chọn phương thức tìm bạn:", keyboard);
  });

  // Tìm ngẫu nhiên (Không yêu cầu điểm)
  bot.action("random", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Kiểm tra trạng thái người dùng trước khi tìm kiếm
    if (user.status === "finding") {
      return ctx.reply(
        "Bạn đang trong quá trình tìm bạn. Vui lòng đợi kết quả trước khi tìm tiếp."
      );
    }

    user.status = "finding";
    await user.save();

    // Tìm một đối tác ngẫu nhiên (không phân biệt giới tính)
    const partner = await User.findOne({
      status: "online",
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

  // Tìm theo giới tính (Yêu cầu điểm)
  bot.action("gender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Kiểm tra điểm trước khi cho người dùng chọn giới tính
    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính. Cần 5 Point để sử dụng chức năng này."
      );
    }

    // Hiển thị các giới tính để người dùng chọn
    const maleButton = Markup.button.callback("Nam", "maleFind");
    const femaleButton = Markup.button.callback("Nữ", "femaleFind");

    const keyboard = Markup.inlineKeyboard([maleButton, femaleButton]);

    return ctx.reply("Chọn giới tính đối tác muốn tìm:", keyboard);
  });

  // Tìm kiếm theo giới tính Nam
  bot.action("maleFind", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Kiểm tra điểm trước khi bắt đầu tìm kiếm
    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính Nam. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.status = "finding";
    await user.save();

    // Tìm người Nam
    const partner = await User.findOne({
      status: "online",
      gender: "male", // Tìm người Nam
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

      // Trừ 5 điểm khi ghép đôi thành công
      user.points -= 5;
      await user.save();
    } else {
      ctx.reply("Không tìm thấy người Nam phù hợp. Vui lòng đợi nhé~");
    }
  });

  // Tìm kiếm theo giới tính Nữ
  bot.action("femaleFind", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    // Kiểm tra điểm trước khi bắt đầu tìm kiếm
    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính Nữ. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.status = "finding";
    await user.save();

    // Tìm người Nữ
    const partner = await User.findOne({
      status: "online",
      gender: "female", // Tìm người Nữ
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

      // Trừ 5 điểm khi ghép đôi thành công
      user.points -= 5;
      await user.save();
    } else {
      ctx.reply("Không tìm thấy người Nữ phù hợp. Vui lòng đợi nhé~");
    }
  });
};
