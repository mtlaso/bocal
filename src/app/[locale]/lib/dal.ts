import { and, count, desc, eq, like, type SQL, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db/db";
import {
	type Feed,
	type FeedTimeline,
	feeds,
	feedsContent,
	feedsTimelineSchema,
	links,
	usersFeeds,
} from "@/db/schema";
import "server-only";
import type { Session } from "next-auth";
import { cache } from "react";
import type { FeedWithContentsCount } from "@/app/[locale]/lib/constants";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { logger } from "@/app/[locale]/lib/logging";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import { auth } from "@/auth";

const ONE_HOUR = 60 * 60 * 1000;

/**
 * verifySession returns the current session (logged in user).
 */
const verifySession = cache(async (): Promise<Session | null> => {
	return await auth();
});

type GetLinksProps = {
	/**
	 * If true, only archived links are returned.
	 */
	archivedLinksOnly?: boolean;
};

/**
 * getUserLinks returns the links of the user.
 */
const getUserLinks = cache(async ({ archivedLinksOnly }: GetLinksProps) => {
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
	} catch (err) {
		logger.error(err);
		throw new Error("errors.unexpected");
	}
});

/**
 * getUserFeedsTimeline returns the contents of the feeds a user follows and the limit of items to show in the timeline.
 */
const getUserFeedsTimeline = cache(
	async (): Promise<[FeedTimeline[], { feedContentLimit: number }]> => {
		try {
			const user = await verifySession();
			if (!user) {
				throw new Error("errors.notSignedIn");
			}

			const query = sql`
        SELECT
           	-- feeds_contents information.
           	fc.id,
           	fc."feedId",
           	fc.date,
           	fc.url,
           	fc.title,
           	fc.content,
            fc."createdAt",
            fc.eid,

            -- users_feeds_read_content information.
           	rc."readAt",
           	-- minimal feed metadata.
            feeds.id AS "feedId",
           	feeds.title AS "feedTitle",
           	feeds.url AS "feedUrl",
           	feeds."errorType" AS "feedErrorType",
           	feeds."lastSyncAt" AS "feedLastSyncAt"
        FROM
           	users_feeds uf
       	JOIN feeds ON feeds.id = uf."feedId"
       	JOIN feeds_content fc ON fc."feedId" = feeds.id
       	LEFT JOIN users_feeds_read_content rc ON rc."feedContentId" = fc.id
        WHERE
           	uf."userId" = ${user.user.id}
        ORDER BY COALESCE(fc.date, feeds."createdAt") DESC`;

			const req = await db.execute(query);
			const { data, error } = feedsTimelineSchema.safeParse(req.rows);
			if (error) {
				logger.error(error.issues);
				throw new z.ZodError(error.issues);
			}

			// Find outdated feeds.
			const now = new Date();
			const outdatedFeedsIds = new Set<number>();
			data.forEach((el) => {
				const isOutdated =
					!el.feedLastSyncAt ||
					now.getTime() - el.feedLastSyncAt.getTime() > ONE_HOUR;
				if (isOutdated) {
					outdatedFeedsIds.add(el.feedId);
				}
			});

			void feedService.triggerBackgroundSync(Array.from(outdatedFeedsIds));
			return [data, { feedContentLimit: user.user.feedContentLimit }];
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

/**
 * getUserFeedsWithContentsCount returns the feeds a user follows with the
 * number of feed_content in each feed.
 */
const getUserFeedsWithContentsCount = cache(
	async (): Promise<FeedWithContentsCount[]> => {
		try {
			const user = await verifySession();
			if (!user) {
				throw new Error("errors.notSignedIn");
			}

			return await db
				.select({
					id: feeds.id,
					title: feeds.title,
					url: feeds.url,
					status: feeds.status,
					contentsCount: count(feedsContent.id),
				})
				.from(feeds)
				.innerJoin(usersFeeds, eq(usersFeeds.feedId, feeds.id))
				.leftJoin(feedsContent, eq(feedsContent.feedId, feeds.id))
				.where(eq(usersFeeds.userId, user.user.id))
				.groupBy(feeds.id);
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

/**
 * getUserNewsletters returns the newsletters a user has.
 */
const getUserNewsletters = cache(async (): Promise<Feed[]> => {
	try {
		const user = await verifySession();
		if (!user) {
			throw new Error("errors.unauthorized");
		}

		return await db
			.select({
				id: feeds.id,
				url: feeds.url,
				title: feeds.title,
				createdAt: feeds.createdAt,
				lastSyncAt: feeds.lastSyncAt,
				status: feeds.status,
				lastError: feeds.lastError,
				errorCount: feeds.errorCount,
				errorType: feeds.errorType,
				eid: feeds.eid,
				newsletterOwnerId: feeds.newsletterOwnerId,
			})
			.from(feeds)
			.where(
				and(
					eq(feeds.newsletterOwnerId, user.user.id),
					like(feeds.url, `${userfeedsfuncs.NEWSLETTER_URL_PREFIX}%`),
				),
			);
	} catch (err) {
		logger.error(err);
		throw new Error("errors.unexpected");
	}
});

/**
 * dal contient les fonctions d'accés aux données.
 */
export const dal = {
	verifySession,
	getUserLinks,
	getUserFeedsTimeline,
	getUserFeedsWithContentsCount,
	getUserNewsletters,
};
