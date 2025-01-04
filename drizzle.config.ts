import { defineConfig, type Config } from "drizzle-kit";
import { config } from "dotenv";

config({
  path: process.env.VERCEL_ENV === "production" ? "env.production.local" : ".env.local"
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
