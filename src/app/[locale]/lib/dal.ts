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
	usersFeedsFolders,
} from "@/db/schema";
import "server-only";
import type { Session } from "next-auth";
import { cache } from "react";
import {
	type FeedFolder,
	type FeedWithContentsCount,
	UNCATEGORIZED_FEEDS_FOLDER_ID,
} from "@/app/[locale]/lib/constants";
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
 * getUserFeedsTimeline returns the contents of the feeds a user follows.
 * Ordered by date descending.
 */
const getUserFeedsTimeline = cache(async (): Promise<FeedTimeline[]> => {
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
		return data;
	} catch (err) {
		logger.error(err);
		throw new Error("errors.unexpected");
	}
});

/**
 * getUserFeedsWithContentsCount returns the feeds a user follows with the
 * number of feeds_content in each feed.
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
					folderId: sql<number>`COALESCE(${usersFeeds.folderId}, ${UNCATEGORIZED_FEEDS_FOLDER_ID})`,
					contentsCount: count(feedsContent.id),
				})
				.from(feeds)
				.innerJoin(usersFeeds, eq(usersFeeds.feedId, feeds.id))
				.leftJoin(feedsContent, eq(feedsContent.feedId, feeds.id))
				.where(eq(usersFeeds.userId, user.user.id))
				.groupBy(feeds.id, usersFeeds.folderId);
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

/**
 * getUserFeedsGroupedByFolder gets:
 *   1. All the feeds folders a user has (including empty folders), with
 *   the feeds in each of those folders.
 *   3. And the feeds that are not in a folder.
 *   In other words: feeds in folder, empty folders, feeds without a folder
 */
const getUserFeedsGroupedByFolder = cache(async (): Promise<FeedFolder[]> => {
	try {
		const user = await verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		// We use two queries because doing this in one query results in
		// a query that is hard to understand. This is simpler.
		//
		// No need for a transaction, a temporary inconsistency in the UI is acceptable
		// e.g. If the first query returns folder programming, the second query returns the feed A is in programming,
		// but the users removes feed A from the folder from an other device, it's ok if there is an inconsistency.
		// Query 1: get the user feeds folders.
		const queryFolders = db
			.select({
				folderId: usersFeedsFolders.id,
				folderName: usersFeedsFolders.name,
			})
			.from(usersFeedsFolders)
			.where(eq(usersFeedsFolders.userId, user.user.id));

		// Query 2: get the user feeds.
		const queryFeeds = db
			.select({
				id: feeds.id,
				title: feeds.title,
				url: feeds.url,
				status: feeds.status,
				folderId: usersFeeds.folderId,
				contentsCount: count(feedsContent.id),
			})
			.from(feeds)
			.leftJoin(usersFeeds, eq(usersFeeds.feedId, feeds.id))
			.leftJoin(feedsContent, eq(feedsContent.feedId, usersFeeds.feedId))
			.where(eq(usersFeeds.userId, user.user.id))
			.groupBy(feeds.id, usersFeeds.folderId)
			.orderBy(feeds.title);

		const [feedsFolders, userFeeds] = await Promise.all([
			queryFolders,
			queryFeeds,
		]);

		// Transform what the database query result into a data structure
		// that can be easily consumed by the frontend (A map that groups the feeds by folder):
		const folders: FeedFolder[] = [];
		folders.push({
			folderId: UNCATEGORIZED_FEEDS_FOLDER_ID,
			folderName: "Uncategorized",
			feeds: [],
		});

		// Add folders to map.
		for (const folder of feedsFolders) {
			folders.push({
				folderId: folder.folderId,
				folderName: folder.folderName,
				feeds: [],
			});
		}

		// Add feeds to map.
		for (const feed of userFeeds) {
			if (!feed.folderId) {
				const uncategorized = folders.find(
					(folder) => folder.folderId === UNCATEGORIZED_FEEDS_FOLDER_ID,
				);
				if (!uncategorized) {
					throw new Error(
						"Uncategorized folder not found. It should have been created before hand.",
					);
				}
				uncategorized.feeds.push({
					id: feed.id,
					title: feed.title,
					url: feed.url,
					status: feed.status,
					contentsCount: feed.contentsCount,
					folderId: UNCATEGORIZED_FEEDS_FOLDER_ID,
				});
			} else {
				const folder = folders.find(
					(folder) => folder.folderId === feed.folderId,
				);
				if (!folder) {
					throw new Error(
						`Folder ${feed.folderId} not found. It should already be inside the folders map.`,
					);
				}
				folder.feeds.push({
					id: feed.id,
					title: feed.title,
					url: feed.url,
					status: feed.status,
					contentsCount: feed.contentsCount,
					folderId: feed.folderId,
				});
			}
		}

		return folders;
	} catch (err) {
		logger.error(err);
		throw new Error("errors.unexpected");
	}
});

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
	getUserFeedsGroupedByFolder,
};
