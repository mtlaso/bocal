import type { InferSelectModel } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";
import { z } from "zod/v4";
import {
	type DEFAULT_USERS_PREFERENCES,
	FeedErrorType,
	FeedStatusType,
	LENGTHS,
} from "@/app/[locale]/lib/constants";

// biome-ignore lint/suspicious/noExplicitAny: locale exception.
function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	// biome-ignore lint/suspicious/noExplicitAny: locale exception.
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	coerce: true,
});

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
	},
	// (table) => [
	// 	check(
	// 		"feedContentLimit_check",
	// 		sql`${table.feedContentLimit} > 0 AND ${table.feedContentLimit} <= 100`,
	// 	),
	// ],
);

/**
 * usersPreferences contains users preferences.
 */
export const usersPreferences = pgTable("users_preferences", {
	userId: text()
		.notNull()
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	prefs: jsonb().notNull().$type<typeof DEFAULT_USERS_PREFERENCES>(),
});

/**
 * links contains links that a user has saved.
 */
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

/**
 * feeds contains the feeds present in the database.
 */
export const feeds = pgTable(
	"feeds",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		// external id.
		// Used when this feed was created as a newsletter.
		eid: uuid().notNull().defaultRandom(),
		// It has a value only when the current feed is a newsletter.
		// This is needed when deleting a newsletter, to make sure that the user deleting a newsletter is the owner of the feed.
		// Otherwise we would have a security vulnerability where anyone who guesses the id can delete the feed.
		newsletterOwnerId: text().references(() => users.id, {
			onDelete: "cascade",
		}),
		url: text().notNull().unique(),
		title: text().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		lastSyncAt: timestamp({ mode: "date" }).defaultNow().notNull(),
		status: text({ enum: enumToPgEnum(FeedStatusType) })
			.notNull()
			.default(FeedStatusType.ACTIVE),
		lastError: text(),
		errorCount: integer().default(0).notNull(),
		errorType: text({
			enum: enumToPgEnum(FeedErrorType),
		}),
	},
	(table) => [uniqueIndex().on(table.eid)],
);

/**
 * feedsContent contains the content of the feeds.
 */
export const feedsContent = pgTable(
	"feeds_content",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		// external id.
		// Only used when the feed content is part of a newsletter feed.
		eid: uuid().notNull().defaultRandom(),
		feedId: integer()
			.notNull()
			.references(() => feeds.id, { onDelete: "cascade" }),
		date: timestamp({ mode: "date" }).notNull(),
		url: text().notNull(),
		title: text().notNull(),
		content: text().notNull(),
		createdAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("url_feedid").on(table.url, table.feedId),
		uniqueIndex().on(table.eid),
	],
);

/**
 * userFeeds contains the feeds that a user is following.
 */
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

/**
 * userFeedsReadContent keep tracks of the feeds content read by a user.
 */
export const usersFeedsReadContent = pgTable(
	"users_feeds_read_content",
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		feedId: integer()
			.notNull()
			.references(() => feeds.id, { onDelete: "cascade" }),
		feedContentId: integer()
			.notNull()
			.references(() => feedsContent.id, { onDelete: "cascade" }),
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

export const insertLinkSchema = createInsertSchema(links, {
	url: (): z.ZodCoercedString => z.url(),
}).pick({ url: true });

export const deleteLinkSchema = createSelectSchema(links, {
	id: (schema): z.ZodCoercedNumber => schema.nonnegative(),
}).pick({ id: true });

export const insertFeedsSchema = createInsertSchema(feeds, {
	url: (): z.ZodCoercedString => z.url(),
}).pick({ url: true });

export const unfollowFeedSchema = createSelectSchema(usersFeeds, {
	feedId: (schema): z.ZodCoercedNumber => schema.nonnegative(),
}).pick({ feedId: true });

export const insertUsersFeedsReadContentSchema = createSelectSchema(
	usersFeedsReadContent,
	{
		feedId: (schema): z.ZodCoercedNumber => schema.nonnegative(),
		feedContentId: (schema): z.ZodCoercedNumber => schema.nonnegative(),
	},
).pick({ feedId: true, feedContentId: true });

export const deleteUsersFeedsReadContentSchema = createSelectSchema(
	usersFeedsReadContent,
	{
		feedId: (schema): z.ZodCoercedNumber => schema.nonnegative(),
		feedContentId: (schema): z.ZodCoercedNumber => schema.nonnegative(),
	},
).pick({ feedId: true, feedContentId: true });

export const addNewsletterSchema = z.object({
	title: z
		.string()
		.min(LENGTHS.newsletters.title.min)
		.max(LENGTHS.newsletters.title.max),
});

export const deleteNewsletterSchema = z.object({
	id: z
		.number({
			error: "errors.idFieldInvalid",
		})
		.nonnegative({
			error: "errors.idFieldInvalid",
		}),
});

const feedTimeline = z.object({
	...createSelectSchema(feedsContent).shape,
	readAt: z.coerce.date().nullable(),
	feedTitle: z.string(),
	feedUrl: z.string(),
	feedErrorType: z.enum(FeedErrorType).nullable(),
	feedLastSyncAt: z.coerce.date(),
});

export const feedsTimelineSchema = z.array(feedTimeline);

export type User = InferSelectModel<typeof users>;
export type Feed = InferSelectModel<typeof feeds>;
export type FeedTimeline = z.infer<typeof feedTimeline>;
