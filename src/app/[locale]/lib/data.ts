import { db } from "@/db/db";
import {
	type UserFeedWithContent,
	feedsWithContentArray,
	links,
} from "@/db/schema";
import { type SQL, and, desc, eq, sql } from "drizzle-orm";
import z from "zod";
import "server-only";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { cache } from "react";

const ONE_HOUR = 60 * 60 * 1000;

export const verifySession = cache(async (): Promise<Session | null> => {
	return await auth();
});

type GetLinksProps = {
	archivedLinksOnly?: boolean;
};

type GetLinksResponse = {
	id: number;
	url: string;
	ogTitle: string | null;
	ogImageURL: string | null;
};

export const getLinks = cache(
	async ({ archivedLinksOnly }: GetLinksProps): Promise<GetLinksResponse[]> => {
		try {
			const user = await verifySession();
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
	},
);

export const getUserFeeds = cache(async (): Promise<UserFeedWithContent[]> => {
	try {
		const user = await verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const limit = user.user.feedContentLimit;

		const req = await db.execute(sql`
    		SELECT
            f.id,
            f.url,
            f.title,
            f."createdAt",
            f."lastSyncAt",
            json_agg(fc_row ORDER BY fc_row.date DESC) AS contents,
            f.status,
            f."lastError",
            f."errorCount",
            f."errorType"
        FROM feeds AS f
        JOIN users_feeds AS uf ON uf."feedId" = f.id
        -- LEFT JOIN because we want to get the feeds event if there is no content.
        --  LATERAL gives the subrequest to access tables outisde the FROM.
        LEFT JOIN LATERAL (
                SELECT fc.id, fc."feedId", fc.date, fc.url, fc.title, fc.content, fc."createdAt", rc."readAt"
                FROM feeds_content AS fc

                -- Join on read_content
                LEFT JOIN users_feeds_read_content AS rc ON rc."feedId" = f.id
                      AND rc."feedContentId" = fc.id

                WHERE fc."feedId" = f.id
                ORDER BY fc.date DESC
                LIMIT ${limit}
            ) AS fc_row ON TRUE
        WHERE uf."userId" = ${user.user.id}
        GROUP BY f.id
        ORDER BY f."createdAt" DESC;
        `);

		const { data, error } = feedsWithContentArray.safeParse(req.rows);
		if (error) {
			throw new z.ZodError(error.issues);
		}

		const now = new Date();
		const outdatedFeeds = data.filter(
			(feed) =>
				!feed.lastSyncAt ||
				now.getTime() - feed.lastSyncAt.getTime() > ONE_HOUR,
		);

		void feedService.triggerBackgroundSync(outdatedFeeds);

		return data;
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
});
