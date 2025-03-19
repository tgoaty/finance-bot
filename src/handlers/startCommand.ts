import { Composer, Context } from "grammy";

export function startCommand() {
	const composer = new Composer<Context>();
	composer.command("start", async (ctx, next) => {
		await ctx.reply("Hello, World!");
		await next();
	});
	return composer;
}
