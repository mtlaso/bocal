import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

// biome-ignore lint/suspicious/noImplicitAnyLet: db.
let _db;

if (!process.env.VERCEL_ENV) {
	_db = drizzle({
		client: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
		schema,
		logger: false,
	});
} else {
	_db = drizzleNeon({
		// biome-ignore lint/style/noNonNullAssertion: db.
		client: neon(process.env.DATABASE_URL!),
		schema,
		logger: false,
	});
}

export const db = _db;
