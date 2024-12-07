import type { FeedContent } from "@/app/[locale]/lib/schema";
import type { InferSelectModel } from "drizzle-orm";
import {
	boolean,
	integer,
	json,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
});

export const links = pgTable("links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	url: text().notNull(),
	userId: text("userId")
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
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp().defaultNow().notNull(),
	lastSyncAt: timestamp(),
	content: json().$type<FeedContent>(),
	status: text().default("active").notNull(),
	lastError: text(),
	errorCount: integer().default(0).notNull(),
});

export const userFeeds = pgTable("user_feeds", {
	userId : text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	feedId: integer()
		.notNull()
		.references(() => feeds.id, { onDelete: "cascade" }),
	
}, (table) => [
	primaryKey({ columns: [table.userId, table.feedId] }),
])



export const accounts = pgTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(table) => [
		primaryKey({ columns: [table.provider, table.providerAccountId] }),
	],
);

export const sessions = pgTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
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
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.credentialID],
		}),
	],
);

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

export type User = InferSelectModel<typeof users>;
