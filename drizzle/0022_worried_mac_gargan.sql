-- ALTER TABLE "accounts" DROP CONSTRAINT "accounts_providerId_providerAccountId_pk";--> statement-breakpoint
-- ALTER TABLE "accounts" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
-- CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("userId");


-- Drop the old primary key first
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_providerId_providerAccountId_pk";
-- Add the id column as nullable first
ALTER TABLE "accounts" ADD COLUMN "id" text;
-- Update existing rows with generated IDs (you can use uuid or any other strategy)
UPDATE "accounts" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
-- Now make it NOT NULL and primary key
ALTER TABLE "accounts" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");
-- Create the index
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("userId");
