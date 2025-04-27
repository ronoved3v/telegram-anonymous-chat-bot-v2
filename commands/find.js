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

    if (user.status === "chatting") {
      return ctx.reply(
        "Bạn đã được ghép đôi. Vui lòng thoát cuộc trò chuyện hiện tại trước khi tìm tiếp." +
          "\nVui lòng sử dụng /stop để thoát cuộc trò chuyện hiện tại."
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

    if (user.status === "finding") {
      return ctx.reply(
        "Bạn đang trong quá trình tìm bạn. Vui lòng đợi kết quả trước khi tìm tiếp."
      );
    }

    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "finding",
      telegramId: { $ne: telegramId },
    });

    if (partner) {
      user.status = "chatting";
      user.partnerId = partner.telegramId;

      partner.status = "chatting";
      partner.partnerId = telegramId;

      await Promise.all([user.save(), partner.save()]);

      await ctx.telegram.sendMessage(
        partner.telegramId,
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! B\u1eaft \u0111\u1ea7u tr\u00f2 chuy\u1ec7n \u0111i nh\u00e9~"
      );
      await ctx.reply(
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! Ch\u00fac b\u1ea1n tr\u00f2 chuy\u1ec7n vui v\u1ebb."
      );
    } else {
      ctx.reply(
        "\u0110ang t\u00ecm ng\u01b0\u1eddi ph\u00f9 h\u1ee3p... Vui l\u00f2ng \u0111\u1ee3i nh\u00e9~"
      );
    }
  });

  // Tìm theo giới tính (Yêu cầu điểm)
  bot.action("gender", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính. Cần 5 Point để sử dụng chức năng này."
      );
    }

    const maleButton = Markup.button.callback("Nam", "maleFind");
    const femaleButton = Markup.button.callback("Nữ", "femaleFind");

    const keyboard = Markup.inlineKeyboard([maleButton, femaleButton]);

    return ctx.reply("Chọn giới tính đối tác muốn tìm:", keyboard);
  });

  // Tìm kiếm theo giới tính Nam
  bot.action("maleFind", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính Nam. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "finding",
      gender: "male",
      telegramId: { $ne: telegramId },
    });

    if (partner) {
      user.status = "chatting";
      user.partnerId = partner.telegramId;
      user.points -= 5;

      partner.status = "chatting";
      partner.partnerId = telegramId;

      await Promise.all([user.save(), partner.save()]);

      await ctx.telegram.sendMessage(
        partner.telegramId,
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! B\u1eaft \u0111\u1ea7u tr\u00f2 chuy\u1ec7n \u0111i nh\u00e9~"
      );
      await ctx.reply(
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! Ch\u00fac b\u1ea1n tr\u00f2 chuy\u1ec7n vui v\u1ebb."
      );
    } else {
      ctx.reply("Không tìm thấy người Nam phù hợp. Vui lòng đợi nhé~");
    }
  });

  // Tìm kiếm theo giới tính Nữ
  bot.action("femaleFind", async (ctx) => {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user.points < 5) {
      return ctx.reply(
        "Bạn không đủ Point để tìm theo giới tính Nữ. Cần 5 Point để sử dụng chức năng này."
      );
    }

    user.status = "finding";
    await user.save();

    const partner = await User.findOne({
      status: "finding",
      gender: "female",
      telegramId: { $ne: telegramId },
    });

    if (partner) {
      user.status = "chatting";
      user.partnerId = partner.telegramId;
      user.points -= 5;

      partner.status = "chatting";
      partner.partnerId = telegramId;

      await Promise.all([user.save(), partner.save()]);

      await ctx.telegram.sendMessage(
        partner.telegramId,
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! B\u1eaft \u0111\u1ea7u tr\u00f2 chuy\u1ec7n \u0111i nh\u00e9~"
      );
      await ctx.reply(
        "\u0110\u00e3 gh\u00e9p \u0111\u00f4i! Ch\u00fac b\u1ea1n tr\u00f2 chuy\u1ec7n vui v\u1ebb."
      );
    } else {
      ctx.reply("Không tìm thấy người Nữ phù hợp. Vui lòng đợi nhé~");
    }
  });
};
