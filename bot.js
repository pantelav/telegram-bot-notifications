require("dotenv").config();
const { Telegraf } = require("telegraf");
const TelegrafStatelessQuestion = require("telegraf-stateless-question");
const { BotModel } = require("./models/BotSchema.js");

const bot = new Telegraf(process.env.BOT_API);
const authBot = new TelegrafStatelessQuestion("auth", async (ctx) => {
	let input = ctx.message.text;
	if (input == process.env.BOT_PASSWORD) {
		try {
			const chatId = ctx.message.chat.id;
			const userName = ctx.message.from.username;
			await BotModel.create({ chatId, userName });
		} catch (error) {
			return ctx.reply("Ошибка сервера");
		}
		ctx.reply("Поздравляю, вы вошли! Ждите новых заявок");
	} else {
		ctx.reply("Пароль не верный");
	}
});

bot.use(authBot.middleware());

bot.command("start", async (ctx) => {
	try {
		let chatId = ctx.message.chat.id;
		const user = await BotModel.findOne({ chatId }).exec()
    if (user) {
      return ctx.reply("Вы уже авторизованы");
    } else {
      let text = "Введите пароль";
      return authBot.replyWithMarkdown(ctx, text);
    }
	} catch (error) {
		console.log(error);
    return ctx.reply("Ошибка сервера");
	}
});

bot.command("logout", async (ctx) => {
  try {
    let chatId = ctx.message.chat.id;
    const deletedUser = await BotModel.deleteOne({ chatId: chatId });
    deletedUser ? ctx.reply("Вы отписались от уведомлений") : ctx.reply("Вы не авторизованы")
  } catch (error) {
    console.log(error);
		return ctx.reply("Ошибка сервера");
  }
})


bot
	.launch()
	.then(() => {
		console.log("Bot Launched");
	})
	.catch((err) => {
		console.log("Bot error: " + err);
	});
exports.bot = bot;

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
