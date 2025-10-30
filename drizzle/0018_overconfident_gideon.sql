ALTER TABLE "users_feeds" DROP CONSTRAINT "users_feeds_folderId_users_feeds_folders_id_fk";
--> statement-breakpoint
CREATE UNIQUE INDEX "users_feeds_folders_userId_id_index" ON "users_feeds_folders" USING btree ("userId","id");
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_folder_ownership_fk" FOREIGN KEY ("userId","folderId") REFERENCES "public"."users_feeds_folders"("userId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
