ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey";
ALTER TABLE "sessions" ADD COLUMN "id" text PRIMARY KEY NOT NULL;
