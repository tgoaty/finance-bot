import { Composer, Context, Keyboard } from "grammy";

const auth_keyboard = new Keyboard().text("Авторизоваться");

export function startCommand() {
	const composer = new Composer<Context>();
	composer.command("start", async (ctx, next) => {
		await ctx.reply("Hello, World!", { reply_markup: auth_keyboard });
		next();
	});
	return composer;
}
