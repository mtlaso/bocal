ALTER TABLE "accounts" RENAME COLUMN "provider" TO "providerId";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "refresh_token" TO "refreshToken";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "access_token" TO "accessToken";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "token_type" TO "idToken";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "sessionToken" TO "token";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "verification_tokens" RENAME COLUMN "token" TO "value";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "verification_tokens" DROP CONSTRAINT "verification_tokens_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DATA TYPE boolean USING ("emailVerified" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_providerId_providerAccountId_pk" PRIMARY KEY("providerId","providerAccountId");--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "accountId" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "accessTokenExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refreshTokenExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
-- ALTER TABLE "verification_tokens" ADD COLUMN "expiresAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" RENAME COLUMN "expires" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification_tokens" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "id_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "session_state";--> statement-breakpoint
-- ALTER TABLE "verification_tokens" DROP COLUMN "expires";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");
