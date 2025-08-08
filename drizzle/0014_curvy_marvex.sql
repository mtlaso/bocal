CREATE TABLE "users_feeds_folders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_feeds_folders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_feeds" ADD COLUMN "folderId" integer;--> statement-breakpoint
ALTER TABLE "users_feeds_folders" ADD CONSTRAINT "users_feeds_folders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_feeds_folders_userId_name_index" ON "users_feeds_folders" USING btree ("userId","name");--> statement-breakpoint
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_folderId_users_feeds_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."users_feeds_folders"("id") ON DELETE cascade ON UPDATE no action;