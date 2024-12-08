import type { FeedContent } from "@/app/[locale]/lib/schema";
import DOMPurify from "isomorphic-dompurify";
import * as xml2js from "xml2js";

const SYNC_TIMEOUT = 5000 as const;
const MAX_CONTENT_SIZE = 5 * 1024 * 1024;
const MAX_ITEMS = 20;

class FeedUnreachable extends Error {
	constructor() {
		super("errors.feedUnreachable");
	}
}

class FeedTooLarge extends Error {
	constructor() {
		super("errors.feedTooLarge");
	}
}

class UrlNotAFeed extends Error {
	constructor() {
		super("errors.urlNotAFeed");
	}
}

class FeedMalformed extends Error {
	constructor() {
		super("errors.feedMalformed");
	}
}

class FeedCannotBeProcessed extends Error {
	constructor() {
		super("errors.feedCannotBeProcessed");
	}
}

const fetchWithTimeout = async (
	url: string,
	msTimeout = SYNC_TIMEOUT,
): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), msTimeout);

	try {
		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent": "RSS bocal.dnncry.dev/1.0",
			},
		});

		if (!response.ok) {
			throw new FeedUnreachable();
		}

		const contentType = response.headers.get("content-type");
		if (!contentType?.includes("xml")) {
			throw new UrlNotAFeed();
		}

		return response;
	} finally {
		clearTimeout(timeoutId);
	}
};

type ParseFeedResponse = {
	title: string;
	content: FeedContent;
};

export async function parseFeed(xml: string): Promise<ParseFeedResponse> {
	try {
		if (xml.length > MAX_CONTENT_SIZE) {
			throw new FeedTooLarge();
		}

		// explicitArray: always put child nodes in an array if true; otherwise an array is created only if there is more than one.
		const parser = new xml2js.Parser({ explicitArray: false });
		const res = await parser.parseStringPromise(xml);

		if (!res.feed && !res.rss) {
			throw new FeedMalformed();
		}

		let items = [];
		const isAtom = res.feed?.entry;

		if (isAtom) {
			const entries = Array.isArray(res.feed.entry)
				? res.feed.entry
				: [res.feed.entry];

			// biome-ignore lint/suspicious/noExplicitAny: feed-service
			items = entries.map((entry: any) => ({
				id: entry.id ?? entry.link?.href ?? entry.link ?? generateId(),
				// TODO: translate "No title"
				title: sanitizeContent(entry.title?.trim()) ?? "No title",
				url: entry.link?.href ?? entry.link,
				content: sanitizeContent(entry.content ?? entry.summary ?? ""),
				date: normalizeDate(entry.updated ?? entry.published).toISOString(),
				creator: entry.author?.name,
			}));
		} else {
			if (!res.rss.channel) {
				throw new FeedCannotBeProcessed();
			}

			const feedItems = Array.isArray(res.rss.channel.item)
				? res.rss.channel.item
				: [res.rss.channel.item];

			// biome-ignore lint/suspicious/noExplicitAny: feed-service
			items = feedItems.map((item: any) => ({
				id: item.guid ?? item.link ?? generateId(),
				// TODO: translate "No title"
				title: sanitizeContent(item.title?.trim()) ?? "No title",
				url: item.link,
				content: sanitizeContent(item.description ?? ""),
				date: normalizeDate(item.pubDate ?? item.date).toISOString(),
				creator: item.author ?? item["dc:creator"],
			}));
		}

		return {
			// TODO: translate "No title"
			title: res.feed?.title ?? res.rss.channel.title ?? "No title",
			content: items
				// .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
				.slice(0, MAX_ITEMS),
		};
	} catch (_err) {
		throw new FeedCannotBeProcessed();
	}
}

function sanitizeContent(content: string): string {
	return DOMPurify.sanitize(content, {
		ALLOWED_TAGS: ["p", "a", "b", "i", "em", "strong", "br"],
		ALLOWED_ATTR: ["href"],
	});
}

function normalizeDate(dateStr: string): Date {
	const date = new Date(dateStr);
	return Number.isNaN(date.getTime()) ? new Date() : date;
}

function generateId(): string {
	return crypto.randomUUID();
}

export const feedService = {
	fetchFeed: fetchWithTimeout,
	parseFeed,
	FeedTooLarge,
	UrlNotAFeed,
	FeedUnreachable,
	FeedMalformed,
	FeedCannotBeProcessed,
};
