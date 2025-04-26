const User = require('../models/User');

module.exports = (bot) => {
    bot.start(async (ctx) => {
        const telegramId = ctx.from.id;
        let user = await User.findOne({ telegramId });

        if (!user) {
            await ctx.reply('Chào mừng bạn! Vui lòng nhập giới tính của bạn: nam / nữ');
            await User.create({ telegramId });
        } else {
            await ctx.reply('Bạn đã có tài khoản. Dùng /find để tìm bạn trò chuyện nhé!');
        }
    });

    bot.hears(/^(nam|nữ)$/i, async (ctx) => {
        const telegramId = ctx.from.id;
        const user = await User.findOne({ telegramId });

        if (user && user.gender === 'unknown') {
            user.gender = ctx.message.text.toLowerCase() === 'nam' ? 'male' : 'female';
            await user.save();
            ctx.reply('Giới tính đã lưu! Bạn có thể dùng /find để bắt đầu tìm bạn.');
        }
    });
};
