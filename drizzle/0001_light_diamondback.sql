ALTER TABLE "feeds" ALTER COLUMN "lastSyncAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "lastSyncAt" SET NOT NULL;