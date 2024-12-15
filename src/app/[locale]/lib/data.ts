import { sortOptions } from "@/app/[locale]/lib/schema";
import { db } from "@/db/db";
import { type Feed, feeds, links, usersFeeds } from "@/db/schema";
import { type SQL, and, asc, desc, eq } from "drizzle-orm";
import "server-only";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { auth } from "@/auth";

const ONE_HOUR = 60 * 60 * 1000;

type GetLinksProps = {
	archivedLinksOnly?: boolean;
	sort?: string;
};

type GetLinksResponse = {
	id: number;
	url: string;
	ogTitle: string | null;
	ogImageURL: string | null;
};

export async function getLinks({
	archivedLinksOnly,
	sort,
}: GetLinksProps): Promise<GetLinksResponse[]> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const archivedFilter: SQL[] = [];
		if (archivedLinksOnly) archivedFilter.push(eq(links.isArchived, true));
		else archivedFilter.push(eq(links.isArchived, false));

		const sortFilter: SQL[] = [];
		if (sort === sortOptions.byDateAsc) sortFilter.push(asc(links.createdAt));
		else sortFilter.push(desc(links.createdAt));

		return await db
			.select({
				id: links.id,
				url: links.url,
				ogTitle: links.ogTitle,
				ogImageURL: links.ogImageURL,
			})
			.from(links)
			.where(and(eq(links.userId, user.user.id), ...archivedFilter))
			.orderBy(...sortFilter);
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}

export async function getUserFeeds(): Promise<Feed[]> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const userFeedsRes = await db
			.select({
				id: feeds.id,
				url: feeds.url,
				title: feeds.title,
				createdAt: feeds.createdAt,
				lastSyncAt: feeds.lastSyncAt,
				content: feeds.content,
				status: feeds.status,
				lastError: feeds.lastError,
				errorCount: feeds.errorCount,
				errorType: feeds.errorType,
			})
			.from(feeds)
			.innerJoin(usersFeeds, eq(usersFeeds.feedId, feeds.id))
			.where(eq(usersFeeds.userId, user.user.id))
			.orderBy(desc(feeds.createdAt));

		const now = new Date();
		const outdatedFeeds = userFeedsRes.filter(
			(feed) =>
				!feed.lastSyncAt ||
				now.getTime() - feed.lastSyncAt.getTime() > ONE_HOUR,
		);

		void feedService.triggerBackgroundSync(outdatedFeeds);

		return userFeedsRes;
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
