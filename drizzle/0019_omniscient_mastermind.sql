ALTER TABLE "users_feeds" DROP CONSTRAINT "users_feeds_folder_ownership_fk";
--> statement-breakpoint
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_folder_ownership_fk" FOREIGN KEY ("userId","folderId") REFERENCES "public"."users_feeds_folders"("userId","id") ON DELETE set null ON UPDATE no action;