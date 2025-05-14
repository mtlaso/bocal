ALTER TABLE "feeds" ADD COLUMN "eid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX "eid_user_id" ON "feeds" USING btree ("eid");--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "eid";