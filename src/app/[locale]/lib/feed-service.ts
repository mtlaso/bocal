import { eq, like, sql } from "drizzle-orm";
import { Feed as FeedCreator } from "feed";
import { decode } from "html-entities";
import { cache } from "react";
import Parser from "rss-parser";
import { z } from "zod/v4";
import { logger } from "@/app/[locale]/lib/logging";
import { parsing } from "@/app/[locale]/lib/parsing";
import {
	FeedErrorType,
	FeedStatusType,
	LENGTHS,
} from "@/app/[locale]/lib/types";
import { db } from "@/db/db";
import { type Feed, feeds, feedsContent } from "@/db/schema";
import "server-only";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";

const USER_AGENT = "RSS https://bocal.fyi/1.0";
const SYNC_BATCH_SIZE = 10;

class FeedCannotBeProcessed extends Error {
	constructor() {
		super("errors.feedCannotBeProcessed");
	}
}

class FeedUnreachable extends Error {
	constructor() {
		super("errors.feedUnreachable");
	}
}

class FeedTimeout extends Error {
	constructor() {
		super("errors.feedTimeout");
	}
}

type ParseResponse = {
	title: string;
	content: {
		title: string;
		url: string;
		content: string;
		date: Date;
	}[];
};

/**
 * parse analyse un flux RSS.
 */
export async function parse(url: string): Promise<ParseResponse> {
	try {
		const feed = await new Parser({
			headers: {
				"User-Agent": USER_AGENT,
			},
		}).parseURL(url);

		feed.items = feed.items.slice(0, LENGTHS.feeds.maxPerUser);

		const content = feed.items.map((item) => {
			return {
				title: decode(
					parsing.sanitizeHTML(item.title ?? parsing.readableUrl(url)),
				),
				url: item.link ?? url,
				content: decode(
					parsing.sanitizeHTML(item.content ?? item.contentSnippet ?? ""),
				),
				date: new Date(item.isoDate ?? item.pubDate ?? new Date()),
			};
		});

		return {
			title: feed.title ?? parsing.readableUrl(url),
			content,
		};
	} catch (err) {
		// biome-ignore lint/suspicious/noExplicitAny: no choice.
		if ((err as any)?.errno === -3008) throw new FeedUnreachable();

		if (err instanceof Error && err.message.includes("timeout"))
			throw new FeedTimeout();

		throw new FeedCannotBeProcessed();
	}
}

async function triggerBackgroundSync(outdatedFeeds: Feed[]): Promise<void> {
	const sync = async (feed: Feed): Promise<void> => {
		try {
			const { content, title } = await parse(feed.url);
			await db.transaction(async (tx) => {
				await tx
					.update(feeds)
					.set({
						title,
						lastSyncAt: new Date(),
						errorCount: 0,
						lastError: null,
						status: FeedStatusType.ACTIVE,
					})
					.where(eq(feeds.id, feed.id));

				// await tx.delete(feedsContent).where(eq(feedsContent.feedId, feed.id));

				await tx
					.insert(feedsContent)
					.values(
						content.map((c) => ({
							feedId: feed.id,
							url: c.url,
							title: c.title,
							content: c.content,
							date: c.date,
						})),
					)
					.onConflictDoNothing();

				logger.info(`Synced ${content.length} items for feed ${feed.id}`);
			});
		} catch (err) {
			let errMsg = "errors.unexpected";
			let errType = FeedErrorType.UNKNOWN;

			if (err instanceof Error) {
				errMsg = err.message;
			}

			if (err instanceof feedService.FeedUnreachable) {
				errMsg = "errors.feedUnreachable";
				errType = FeedErrorType.FETCH;
			}

			if (err instanceof feedService.FeedCannotBeProcessed) {
				errMsg = "errors.feedCannotBeProcessed";
				errType = FeedErrorType.PARSE;
			}

			if (err instanceof feedService.FeedTimeout) {
				errMsg = "errors.feedTimeout";
				errType = FeedErrorType.TIMEOUT;
			}

			await db
				.update(feeds)
				.set({
					errorCount: sql`${feeds.errorCount} + 1`,
					lastError: errMsg,
					errorType: errType,
					status: FeedStatusType.ERROR,
				})
				.where(eq(feeds.id, feed.id));
		}
	};

	const syncPromises = outdatedFeeds.map((feed) => sync(feed));

	for (let i = 0; i < syncPromises.length; i += SYNC_BATCH_SIZE) {
		const batch = syncPromises.slice(i, i + SYNC_BATCH_SIZE);
		await Promise.all(batch);
	}
}

type GenerateUserAtomFeedResponse = {
	error:
		| "feed-not-found"
		| "multiple-feeds-with-same-eid"
		| "invalid-eid"
		| null;
	atom: string | null;
};

/**
 * generateUserAtomFeed returns the contents in a feed.
 * This is not checking if the user is authenticated
 * because this is used in `bocal.fyi/userfeeds/<feed-eid>`,
 * where the feed needs to be accessible without authentication.
 * E.g. A user could add the feed to an other feed reader (e.g. Feedly, NewsBlur, etc.).
 *
 * This also makes sure that the user owning the feed has an active
 * subscription or is in trial.
 * As long as the user owning this user feed has an active subscription or is in trial,
 *  the feed content is accessible.
 * We don't care how it is accessed.
 * We only want that the user is paying.
 *
 * @param eid - External id of the feed.
 */
const generateUserAtomFeed = cache(
	async (eid: string): Promise<GenerateUserAtomFeedResponse> => {
		try {
			// Todo: make sure the user is paying or is in trial
			// E.g
			// Ex: “eid → feed → newsletterOwnerId → user → check payment/free trial status”
			logger.warn("TODO: make sure the user is paying or is in trial");

			// Check if eid is a valid uuid.
			if (!z.uuid().safeParse(eid).success) {
				return { error: "invalid-eid", atom: null };
			}

			const feed = await db
				.select({
					id: feeds.id,
					url: feeds.url,
					eid: feeds.eid,
					title: feeds.title,
					createdAt: feeds.createdAt,
					lastSyncAt: feeds.lastSyncAt,
				})
				.from(feeds)
				.where(eq(feeds.eid, eid))
				.limit(1);

			if (!feed || feed.length === 0) {
				return { error: "feed-not-found", atom: null };
			}

			if (feed.length > 1) {
				logger.error("Multiple feeds found for the given eid", eid);
				return { error: "multiple-feeds-with-same-eid", atom: null };
			}

			const contents = await db
				.select({
					url: feedsContent.url,
					title: feedsContent.title,
					createdAt: feedsContent.createdAt,
					content: feedsContent.content,
				})
				.from(feedsContent)
				.where(eq(feedsContent.feedId, feed[0].id));

			// https://validator.w3.org/feed/docs/atom.html
			const atom = new FeedCreator({
				id: feed[0].eid,
				title: feed[0].title,
				copyright: "",
				updated: feed[0].lastSyncAt,
				link: feed[0].url,
				// TODO: create an endpoint to generate beautiful images
				// E.g. /api/atom/image?text=<title>
				image: "https://bocal.fyi/api/og",
				author: {
					name: "bocal.fyi",
					avatar: "https://bocal.fyi/api/og",
					email: "contact@bocal.fyi",
					link: "https://bocal.fyi",
				},
			});

			contents.map((content) => {
				// https://validator.w3.org/feed/docs/atom.html
				atom.addItem({
					title: content.title,
					link: content.url,
					date: content.createdAt,
					content: content.content,
				});
			});

			return { error: null, atom: atom.atom1() };
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

type GetFeedContentResponse = {
	error: "not-found" | "invalid-eid" | null;
	content: string | null;
};

/**
 * getFeedContent returns a specific content inside a feed.
 * This is not checking if the user is authenticated
 * because this is used in `bocal.fyi/userfeeds/<feed-eid>/content/<feed-content-eid>`,
 * where the feed needs to be accessible without authentication.
 * E.g. A user could look at the content using another feed reader (e.g. Feedly, NewsBlur, etc.).
 *
 * This also makes sure that the user owning the feed has an active
 * subscription or is in trial.
 * As long as the user owning this user feed has an active subscription or is in trial,
 *  the feed content is accessible.
 * We don't care how it is accessed.
 * We only want that the user is paying.
 *
 * @param eid - External id of the feed_content.
 *
 */
const getFeedContent = cache(
	async (eid: string): Promise<GetFeedContentResponse> => {
		try {
			// Todo: make sure the user is paying or is in trial
			// E.g
			// Ex: “eid → feed → newsletterOwnerId → user → check payment/free trial status”
			logger.warn("TODO: make sure the user is paying or is in trial");

			// Check if eid is a valid uuid.
			if (!z.uuid().safeParse(eid).success) {
				return { error: "invalid-eid", content: null };
			}

			/*
  		select content
  		from feeds_content
  		where url LIKE 'https://bocal.fyi/userfeeds/%/content/b2b3ada4-b5b3-438b-9e25-f775022f9331'
		*/

			const feedContent = await db
				.select({
					content: feedsContent.content,
				})
				.from(feedsContent)
				.where(
					like(
						feedsContent.url,
						`${userfeedsfuncs.NEWSLETTER_URL_PREFIX}%/content/${eid}`,
					),
				)
				.limit(1);

			if (!feedContent.length) {
				return { error: "not-found", content: null };
			}

			const sanitized = parsing.sanitizeHTML(feedContent[0].content);

			return { error: null, content: sanitized };
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

/**
 * feedService contient les fonctions pour gérer les flux RSS.
 */
export const feedService = {
	parse,
	FeedUnreachable,
	FeedCannotBeProcessed,
	FeedTimeout,
	triggerBackgroundSync,
	generateUserAtomFeed,
	getFeedContent,
};
