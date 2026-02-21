CREATE SCHEMA IF NOT EXISTS public;
CREATE TABLE "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticators_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticators_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "feeds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feeds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"eid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"newsletterOwnerId" text,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastSyncAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"lastError" text,
	"errorCount" integer DEFAULT 0 NOT NULL,
	"errorType" text,
	CONSTRAINT "feeds_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "feeds_content" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feeds_content_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"eid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"feedId" integer NOT NULL,
	"date" timestamp NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" text NOT NULL,
	"userId" text NOT NULL,
	"ogTitle" text,
	"ogImageURL" text,
	"isArchived" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_feeds" (
	"userId" text NOT NULL,
	"feedId" integer NOT NULL,
	"folderId" integer,
	CONSTRAINT "users_feeds_userId_feedId_pk" PRIMARY KEY("userId","feedId")
);
--> statement-breakpoint
CREATE TABLE "users_feeds_folders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_feeds_folders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_feeds_read_content" (
	"userId" text NOT NULL,
	"feedId" integer NOT NULL,
	"feedContentId" integer NOT NULL,
	"readAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_feeds_read_content_userId_feedId_feedContentId_pk" PRIMARY KEY("userId","feedId","feedContentId")
);
--> statement-breakpoint
CREATE TABLE "users_preferences" (
	"userId" text PRIMARY KEY NOT NULL,
	"prefs" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_newsletterOwnerId_users_id_fk" FOREIGN KEY ("newsletterOwnerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feeds_content" ADD CONSTRAINT "feeds_content_feedId_feeds_id_fk" FOREIGN KEY ("feedId") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_feedId_feeds_id_fk" FOREIGN KEY ("feedId") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds_folders" ADD CONSTRAINT "users_feeds_folders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds_read_content" ADD CONSTRAINT "users_feeds_read_content_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds_read_content" ADD CONSTRAINT "users_feeds_read_content_feedId_feeds_id_fk" FOREIGN KEY ("feedId") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_feeds_read_content" ADD CONSTRAINT "users_feeds_read_content_feedContentId_feeds_content_id_fk" FOREIGN KEY ("feedContentId") REFERENCES "public"."feeds_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_preferences" ADD CONSTRAINT "users_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "feeds_eid_index" ON "feeds" USING btree ("eid");--> statement-breakpoint
CREATE UNIQUE INDEX "url_feedid" ON "feeds_content" USING btree ("url","feedId");--> statement-breakpoint
CREATE UNIQUE INDEX "feeds_content_eid_index" ON "feeds_content" USING btree ("eid");--> statement-breakpoint
CREATE UNIQUE INDEX "users_feeds_folders_userId_name_index" ON "users_feeds_folders" USING btree ("userId","name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_feeds_folders_userId_id_index" ON "users_feeds_folders" USING btree ("userId","id");
ALTER TABLE "users_feeds" ADD CONSTRAINT "users_feeds_folder_ownership_fk" FOREIGN KEY ("userId","folderId") REFERENCES "public"."users_feeds_folders"("userId","id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
