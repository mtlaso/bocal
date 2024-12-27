import { createHash } from "node:crypto";
import { removeWWW } from "@/app/[locale]/lib/remove-www";
import { sanitizeHTML } from "@/app/[locale]/lib/sanitize-html";
import type { FeedContent } from "@/app/[locale]/lib/types";
import { db } from "@/db/db";
import { type Feed, feeds } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { decode } from "html-entities";
import Parser from "rss-parser";

const MAX_ITEMS = 20;
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

type ParseFeedResponse = {
	title: string;
	content: FeedContent[];
};

export async function parseFeed(url: string): Promise<ParseFeedResponse> {
	try {
		const feed = await new Parser({
			headers: {
				"User-Agent": USER_AGENT,
			},
		}).parseURL(url);

		feed.items = feed.items.slice(0, MAX_ITEMS);

		const content = feed.items.map((item) => {
			return {
				// TODO: should we use guid or always generate a stable id?
				// guid could somehow be the same for different items if the feed is not well formed...
				id: item.guid ?? generateStableId(item),
				title: decode(sanitizeHTML(item.title ?? removeWWW(url))),
				url: item.link ?? url,
				content: decode(
					sanitizeHTML(item.content ?? item.contentSnippet ?? ""),
				),
				date: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
			} satisfies FeedContent;
		});

		return {
			title: feed.title ?? removeWWW(url),
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

function generateStableId(item: Parser.Item): string {
	const stableString = `${item.title}-${item.guid}-${item.link ?? ""}`;
	return createHash("md5").update(stableString).digest("hex");
}

async function triggerBackgroundSync(outdatedFeeds: Feed[]): Promise<void> {
	const sync = async (feed: Feed): Promise<void> => {
		try {
			const { content, title } = await feedService.parseFeed(feed.url);
			await db
				.update(feeds)
				.set({
					content,
					title,
					lastSyncAt: new Date(),
					errorCount: 0,
					lastError: null,
					status: "active",
				})
				.where(eq(feeds.id, feed.id));
		} catch (err) {
			let errMsg = "errors.unexpected";
			let errType:
				| "fetch_error"
				| "parse_error"
				| "timeout_error"
				| "invalid_url"
				| "unknown_error" = "unknown_error";

			if (err instanceof Error) {
				errMsg = err.message;
			}

			if (err instanceof feedService.FeedUnreachable) {
				errMsg = "errors.feedUnreachable";
				errType = "fetch_error";
			}

			if (err instanceof feedService.FeedCannotBeProcessed) {
				errMsg = "errors.feedCannotBeProcessed";
				errType = "parse_error";
			}

			if (err instanceof feedService.FeedTimeout) {
				errMsg = "errors.feedTimeout";
				errType = "timeout_error";
			}

			await db
				.update(feeds)
				.set({
					errorCount: sql`${feeds.errorCount} + 1`,
					lastError: errMsg,
					errorType: errType,
					status: "error",
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

export const feedService = {
	parseFeed,
	FeedUnreachable,
	FeedCannotBeProcessed,
	FeedTimeout,
	triggerBackgroundSync,
};
