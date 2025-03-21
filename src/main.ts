import { Bot } from "grammy";
import "jsr:@std/dotenv/load";
import { startCommand } from "./handlers/startCommand.ts";
import { Database } from "./db/db_class.ts";
import { auth } from "./handlers/auth.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");

if (!TOKEN) {
	throw new Error("Token doesn't exist");
}

Database.createTables();

export const bot = new Bot(TOKEN);

bot.use(
	startCommand(),
	auth(),
);

bot.start();
