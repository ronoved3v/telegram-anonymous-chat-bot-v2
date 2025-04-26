const User = require('../models/User');

module.exports = (bot) => {
    bot.command('checkin', async (ctx) => {
        const telegramId = ctx.from.id;
        const user = await User.findOne({ telegramId });

        if (!user) return ctx.reply('Bạn chưa đăng ký.');

        const today = new Date();
        const lastCheckIn = user.lastCheckIn || new Date(0);

        if (today.toDateString() === lastCheckIn.toDateString()) {
            ctx.reply('Bạn đã điểm danh hôm nay rồi! ✨');
        } else {
            user.points += 10;
            user.lastCheckIn = today;
            await user.save();
            ctx.reply('Điểm danh thành công! Bạn nhận được 10 điểm 🎁');
        }
    });
};
