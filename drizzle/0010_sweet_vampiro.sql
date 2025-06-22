ALTER TABLE "feeds_content" ADD COLUMN "eid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "feeds_content_eid_index" ON "feeds_content" USING btree ("eid");