import { createHash } from "node:crypto";
import { removeWWW } from "@/app/[locale]/lib/remove-www";
import { sanitizeHTML } from "@/app/[locale]/lib/sanitize-html";
import type { FeedContent } from "@/app/[locale]/lib/schema";
import { decode } from "html-entities";
import Parser from "rss-parser";

const MAX_ITEMS = 20;
const USER_AGENT = "RSS bocal.dnncry.dev/1.0";

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
				id: item.guid ?? generateStableId(item),
				title: item.title ? decode(sanitizeHTML(item.title)) : removeWWW(url),
				url: item.link ?? url,
				content: decode(
					sanitizeHTML(item.content ?? item.contentSnippet ?? ""),
				),
				date: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
				author: item.creator ? decode(sanitizeHTML(item.creator)) : "",
			} satisfies FeedContent;
		});

		return {
			title: feed.title ?? removeWWW(url),
			content,
		};
	} catch (err) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		if ((err as any)?.errno === -3008) throw new FeedUnreachable();

		throw new FeedCannotBeProcessed();
	}
}

function generateStableId(item: Parser.Item): string {
	const stableString = `${item.title}-${item.guid}-${item.guid}`;
	return createHash("md5").update(stableString).digest("hex");
}

export const feedService = {
	parseFeed,
	FeedUnreachable,
	FeedCannotBeProcessed,
};
