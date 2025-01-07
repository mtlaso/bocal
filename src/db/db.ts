import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PoolPg } from "pg";

import * as schema from "./schema";

// biome-ignore lint/suspicious/noImplicitAnyLet: locale exception.
let pool;
// biome-ignore lint/suspicious/noImplicitAnyLet: locale exception.
let _db;

if (!process.env.VERCEL_ENV) {
	pool = new PoolPg({
		connectionString: process.env.DATABASE_URL,
	});
	_db = drizzlePg({ client: pool, schema, logger: false });
} else {
	pool = new Pool({ connectionString: process.env.DATABASE_URL });
	_db = drizzle({ client: pool, schema, logger: false });
}

export const db = _db;
