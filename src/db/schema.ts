import {
	type FeedContent,
	FeedErrorType,
	FeedStatusType,
} from "@/app/[locale]/lib/types";
import { type InferSelectModel, and, gt, lte, sql } from "drizzle-orm";
import {
	boolean,
	check,
	integer,
	json,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";

// biome-ignore lint/suspicious/noExplicitAny: locale exception.
function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	// biome-ignore lint/suspicious/noExplicitAny: locale exception.
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const MAX_FEED_CONTENT_LIMIT = 100;
export const users = pgTable(
	"users",
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text(),
		email: text().unique(),
		emailVerified: timestamp({ mode: "date" }),
		image: text(),
		feedContentLimit: integer().default(10).notNull(),
	},
	(table) => [
		check(
			"feedContentLimit_check",
			sql`
    ${and(gt(table.feedContentLimit, 0), lte(table.feedContentLimit, MAX_FEED_CONTENT_LIMIT))}
      `,
		),
	],
);

export const links = pgTable("links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	url: text().notNull(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	ogTitle: text(),
	ogImageURL: text(),
	isArchived: boolean().default(false),
	createdAt: timestamp().defaultNow().notNull(),
});

export const feeds = pgTable("feeds", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	url: text().notNull().unique(),
	title: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	lastSyncAt: timestamp(),
	content: json().$type<FeedContent[]>(),
	status: text({ enum: enumToPgEnum(FeedStatusType) })
		.notNull()
		.default(FeedStatusType.ACTIVE),
	lastError: text(),
	errorCount: integer().default(0).notNull(),
	errorType: text({
		enum: enumToPgEnum(FeedErrorType),
	}),
});

export const usersFeeds = pgTable(
	"users_feeds",
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		feedId: integer()
			.notNull()
			.references(() => feeds.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.feedId] })],
);

export const usersFeedsReadContent = pgTable(
	"users_feeds_read_content",
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		feedId: integer()
			.notNull()
			.references(() => feeds.id, { onDelete: "cascade" }),
		feedContentId: text().notNull(),
		readAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.feedId, table.feedContentId],
		}),
	],
);

export const accounts = pgTable(
	"accounts",
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text().$type<AdapterAccountType>().notNull(),
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refresh_token: text(),
		access_token: text(),
		expires_at: integer(),
		token_type: text(),
		scope: text(),
		id_token: text(),
		session_state: text(),
	},
	(table) => [
		primaryKey({ columns: [table.provider, table.providerAccountId] }),
	],
);

export const sessions = pgTable("sessions", {
	sessionToken: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp({ mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text().notNull(),
		token: text().notNull(),
		expires: timestamp({ mode: "date" }).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.identifier, table.token],
		}),
	],
);

export const authenticators = pgTable(
	"authenticators",
	{
		credentialID: text().notNull().unique(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text().notNull(),
		credentialPublicKey: text().notNull(),
		counter: integer().notNull(),
		credentialDeviceType: text().notNull(),
		credentialBackedUp: boolean().notNull(),
		transports: text(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.credentialID],
		}),
	],
);

export const insertUsersSchema = createInsertSchema(users, {
	feedContentLimit: (schema): Zod.ZodNumber =>
		schema.feedContentLimit
			.gt(0, {
				message: "errors.feedContentLimitFieldInvalid",
			})
			.lte(MAX_FEED_CONTENT_LIMIT, {
				message: "errors.feedContentLimitFieldInvalid",
			}),
}).pick({ feedContentLimit: true });

export const insertLinksSchema = createInsertSchema(links, {
	url: (schema): Zod.ZodString =>
		schema.url.url({
			message: "errors.urlFieldInvalid",
		}),
}).pick({ url: true });

export const deleteLinkSchema = createSelectSchema(links, {
	id: (schema): Zod.ZodNumber =>
		schema.id.nonnegative({
			message: "errors.idFieldInvalid",
		}),
}).pick({ id: true });

export const insertFeedsSchema = createInsertSchema(feeds, {
	url: (schema): Zod.ZodString =>
		schema.url.url({
			message: "errors.urlFieldInvalid",
		}),
}).pick({ url: true });

export const unfollowFeedSchema = createSelectSchema(usersFeeds, {
	feedId: (schema): Zod.ZodNumber =>
		schema.feedId.nonnegative({
			message: "errors.idFieldInvalid",
		}),
}).pick({ feedId: true });

export const insertUsersFeedsReadContentSchema = createSelectSchema(
	usersFeedsReadContent,
	{
		feedId: (schema): Zod.ZodNumber =>
			schema.feedId.nonnegative({
				message: "errors.idFieldInvalid",
			}),
		feedContentId: (schema): Zod.ZodString =>
			schema.feedContentId.nonempty({
				message: "errors.feedContentIdFieldInvalid",
			}),
	},
).pick({ feedId: true, feedContentId: true });

export const deleteUsersFeedsReadContentSchema = createSelectSchema(
	usersFeedsReadContent,
	{
		feedId: (schema): Zod.ZodNumber =>
			schema.feedId.nonnegative({
				message: "errors.idFieldInvalid",
			}),
		feedContentId: (schema): Zod.ZodString =>
			schema.feedContentId.nonempty({
				message: "errors.feedContentIdFieldInvalid",
			}),
	},
).pick({ feedId: true, feedContentId: true });

export type User = InferSelectModel<typeof users>;
export type Feed = InferSelectModel<typeof feeds>;
export type UsersFeedsReadContent = InferSelectModel<
	typeof usersFeedsReadContent
>;
