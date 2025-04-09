import { parsing } from "@/app/[locale]/lib/parsing";
import { FeedErrorType, FeedStatusType } from "@/app/[locale]/lib/types";
import { db } from "@/db/db";
import { type Feed, MAX_FEED_PER_USER, feeds, feedsContent } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { decode } from "html-entities";
import Parser from "rss-parser";
import "server-only";

const USER_AGENT = "RSS bocal.dnncry.dev/1.0";
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

		feed.items = feed.items.slice(0, MAX_FEED_PER_USER);

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
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

				await tx.delete(feedsContent).where(eq(feedsContent.feedId, feed.id));

				await tx.insert(feedsContent).values(
					content.map((c) => ({
						feedId: feed.id,
						url: c.url,
						title: c.title,
						content: c.content,
						date: c.date,
					})),
				);
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

/**
 * feedService contient les fonctions pour gérer les flux RSS.
 */
export const feedService = {
	parse,
	FeedUnreachable,
	FeedCannotBeProcessed,
	FeedTimeout,
	triggerBackgroundSync,
};
