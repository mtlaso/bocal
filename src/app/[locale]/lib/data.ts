import { db } from "@/db/db";
import {
	type Feed,
	type UsersFeedsReadContent,
	feeds,
	links,
	usersFeeds,
	usersFeedsReadContent,
} from "@/db/schema";
import { type SQL, and, desc, eq } from "drizzle-orm";
import "server-only";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { auth } from "@/auth";

const ONE_HOUR = 60 * 60 * 1000;

type GetLinksProps = {
	archivedLinksOnly?: boolean;
};

type GetLinksResponse = {
	id: number;
	url: string;
	ogTitle: string | null;
	ogImageURL: string | null;
};

export async function getLinks({
	archivedLinksOnly,
}: GetLinksProps): Promise<GetLinksResponse[]> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const archivedFilter: SQL[] = [];
		if (archivedLinksOnly) archivedFilter.push(eq(links.isArchived, true));
		else archivedFilter.push(eq(links.isArchived, false));

		return await db
			.select({
				id: links.id,
				url: links.url,
				ogTitle: links.ogTitle,
				ogImageURL: links.ogImageURL,
			})
			.from(links)
			.where(and(eq(links.userId, user.user.id), ...archivedFilter))
			.orderBy(desc(links.createdAt))
			.execute();
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}

export async function getUserFeeds(): Promise<{
	feeds: Feed[];
	limit: number;
}> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		// This is returned from the function so we wont have to call `await auth()` outside which would send a request to the database,
		// therefore slowing down the response time.
		// Not ideal but it's a tradeoff for performance.
		const limit = user.user.feedContentLimit;

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

		return { feeds: userFeedsRes, limit };
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}

export async function isFeedContentRead(
	feedId: number,
	feedContentId: string,
): Promise<UsersFeedsReadContent | null> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const data = await db
			.select({
				userId: usersFeedsReadContent.userId,
				feedId: usersFeedsReadContent.feedId,
				feedContentId: usersFeedsReadContent.feedContentId,
				readAt: usersFeedsReadContent.readAt,
			})
			.from(usersFeedsReadContent)
			.limit(1)
			.where(
				and(
					eq(usersFeedsReadContent.userId, user.user.id),
					eq(usersFeedsReadContent.feedId, feedId),
					eq(usersFeedsReadContent.feedContentId, feedContentId),
				),
			)
			.execute();

		if (data.length === 0) {
			return null;
		}

		return data[0];
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
