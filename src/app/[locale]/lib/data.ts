import { sortOptions } from "@/app/[locale]/lib/schema";
import { auth } from "@/auth";
import { db } from "@/db/db";
import { type Feed, feeds, links, usersFeeds } from "@/db/schema";
import { type SQL, and, asc, desc, eq } from "drizzle-orm";
import "server-only";

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

/**
 * Get user feeds.
 * Also triggers background sync for feeds to get the latest content.
 */
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

		// TODO: Implement background sync
		// void triggetBackgroundSync(userFeedsRes);

		return userFeedsRes;
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
