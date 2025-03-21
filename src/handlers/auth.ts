import { Composer, Context } from "grammy";
import { Database } from "../db/db_class.ts";

export function auth() {
	const composer = new Composer<Context>();
	composer.hears("Авторизоваться", async (ctx, next) => {
		if (ctx.from?.id) {
			await Database.createUser(ctx.from.id, ctx.from.username ?? "Без имени");
			await ctx.reply("Регистрация прошла успешно!", { reply_markup: { remove_keyboard: true } });
			await next();
		} else {
			await ctx.reply(`Регистрация не удалась`, { reply_markup: { remove_keyboard: true } });
			await next();
		}
	});
	return composer;
}
