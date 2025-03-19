import "jsr:@std/dotenv/load";
import { Client } from "https://deno.land/x/postgres/mod.ts";

export class Database {
	static PG_LINK = Deno.env.get("PG_LINK");
	static client = new Client(this.PG_LINK);

	static createTables = async () => {
		const tables = [
			{
				name: "users",
				schema: `
                    CREATE TABLE users
                    (
                        id          SERIAL PRIMARY KEY,
                        telegram_id BIGINT UNIQUE       NOT NULL,
                        username    VARCHAR(255) UNIQUE NOT NULL,
                        created_at  TIMESTAMP DEFAULT NOW()
                    );
                `,
			},
			{
				name: "categories",
				schema: `
					CREATE TABLE categories
					(
						id   SERIAL PRIMARY KEY,
						name VARCHAR(255) NOT NULL,
						type VARCHAR(50)  NOT NULL CHECK (type IN ('income', 'expense'))
					);
				`,
			},
			{
				name: "transactions",
				schema: `
                    CREATE TABLE transactions
                    (
                        id            SERIAL PRIMARY KEY,
                        user_id       INT            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                        categories_id INT            NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
                        amount        DECIMAL(10, 2) NOT NULL,
                        type          VARCHAR(50)    NOT NULL CHECK (type IN ('income', 'expense')),
                        date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        description   TEXT,
                        CONSTRAINT valid_amount CHECK (amount > 0 )
                    );
                `,
			},
			{
				name: "limits",
				schema: `
					CREATE TABLE limits
					(
						id            SERIAL PRIMARY KEY,
						user_id       INT            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
						categories_id INT            NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
						limit_amount  DECIMAL(10, 2) NOT NULL,
						period VARCHAR (50) NOT NULL CHECK (period IN ('day', 'week', 'month')),
						CONSTRAINT valid_limit CHECK (limit_amount > 0 )
					);
				`,
			},
		];
		await this.client.connect();
		for (const table of tables) {
			const exist = await this.tableExist(table.name, this.client);
			if (!exist) {
				console.log(`Creating table: ${table.name}`);
				await this.client.queryObject(table.schema);
			} else {
				console.log(`Table ${table.name} already exists`);
			}
		}
		await this.client.end();
	};
	static tableExist = async (tableName: string, client: Client): Promise<boolean> => {
		const result = await client.queryObject<{ exists: boolean }>(
			"SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = $1)",
			[tableName],
		);
		return result.rows[0].exists as boolean;
	};
}
