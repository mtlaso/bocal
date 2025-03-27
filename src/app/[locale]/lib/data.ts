import { db } from "@/db/db";
import {
	type UserFeedsWithContent as UserFeedWithContent,
	type UsersFeedsReadContent,
	links,
	usersFeedsReadContent,
	usersFeedsWithContent,
} from "@/db/schema";
import { type SQL, and, desc, eq, sql } from "drizzle-orm";
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

// type FeedsWithContent = Feed[] &
// 	{
// 		contents: FeedsContent[];
// 	}[];

type GetUserFeedsProps = {
	feeds: UserFeedWithContent[];
	limit: number;
};

export async function getUserFeeds(): Promise<GetUserFeedsProps> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		// This is returned from the function so we wont have to call `await auth()` outside which would send a request to the database,
		// therefore slowing down the response time.
		// Not ideal but it's a tradeoff for performance.
		const limit = user.user.feedContentLimit;

		const req = await db.execute(sql`
    		SELECT
            f.id,
            f.url,
            f.title,
            f."createdAt",
            f."lastSyncAt",
            array_to_json(array_agg(fc_row)) AS contents,
            f.status,
            f."lastError",
            f."errorCount",
            f."errorType"
        FROM feeds AS f
        JOIN users_feeds AS uf ON uf."feedId" = f.id
        -- LEFT JOIN because we want to get the feeds event if there is no content.
        --  LATERAL gives the subrequest to access tables outisde the FROM.
        LEFT JOIN LATERAL (
                SELECT fc.id, fc."feedId", fc.date, fc.url, fc.title, fc.content, fc."createdAt"
                FROM feeds_content AS fc
                WHERE fc."feedId" = f.id
                ORDER BY fc.date DESC
                LIMIT ${limit}
            ) AS fc_row ON TRUE
        WHERE uf."userId" = ${user.user.id}
        GROUP BY f.id
        ORDER BY f."createdAt" DESC;
        `);

		const data = usersFeedsWithContent.safeParse(req.rows);
		if (!data.success) {
			throw new Error("errors.unexpected");
		}

		const userFeedsRes = data.data;

		const now = new Date();
		const outdatedFeeds = userFeedsRes.filter(
			(feed) =>
				!feed.lastSyncAt ||
				now.getTime() - feed.lastSyncAt.getTime() > ONE_HOUR,
		);

		void feedService.triggerBackgroundSync(outdatedFeeds);

		return {
			feeds: userFeedsRes,
			limit,
		};
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}

export async function isFeedContentRead(
	feedId: number,
	feedContentId: number,
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
