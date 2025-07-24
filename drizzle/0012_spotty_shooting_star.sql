CREATE TABLE "users_preferences" (
	"userId" text PRIMARY KEY NOT NULL,
	"prefs" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_preferences" ADD CONSTRAINT "users_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;