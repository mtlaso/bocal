import { and, desc, eq, like, type SQL, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db/db";
import {
	type Feed,
	type FeedTimeline,
	feeds,
	feedsTimelineSchema,
	links,
} from "@/db/schema";
import "server-only";
import type { Session } from "next-auth";
import { cache } from "react";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { logger } from "@/app/[locale]/lib/logging";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import { auth } from "@/auth";

const ONE_HOUR = 60 * 60 * 1000;

/**
 * verifySession vérifie la session actuelle.
 */
const verifySession = cache(async (): Promise<Session | null> => {
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

/**
 * getLinks retourne les liens de l'utilisateur.
 */
const getLinks = cache(
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
		} catch (err) {
			logger.error(err);
			throw new Error("errors.unexpected");
		}
	},
);

/**
 * getUserFeedsTimeline returns the contents of the feeds a user follows.
 */
const getUserFeedsTimeline = cache(
	async ({
		/**
		 * Only returns the feeds_contents that are part of a newsletter.
		 * Newsletters are stored in the 'feeds' table.
		 * Their url start with 'https://bocal.fyi/userfeeds/xxxx'.
		 */
		onlyNewsletters = false,
	}): Promise<FeedTimeline[]> => {
		try {
			const user = await verifySession();
			if (!user) {
				throw new Error("errors.notSignedIn");
			}

			const limit = user.user.feedContentLimit;
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
           	feeds.title AS "feedTitle",
            feeds.url AS "feedUrl",
           	feeds."errorType" AS "feedErrorType",
            feeds."lastSyncAt" AS "feedLastSyncAt"
        FROM
           	feeds_content fc
       	JOIN
            feeds ON feeds.id = fc."feedId"
       	JOIN
            users_feeds uf ON uf."feedId" = fc."feedId"
       	LEFT JOIN
            users_feeds_read_content rc ON rc."feedContentId" = fc.id
        WHERE
                uf."userId" = ${user.user.id}
                ${onlyNewsletters ? sql`AND f.URL LIKE ${`${userfeedsfuncs.NEWSLETTER_URL_PREFIX}%`}` : sql``}
        ORDER BY fc.date DESC
        LIMIT ${limit}
	`;

			const req = await db.execute(query);
			const { data, error } = feedsTimelineSchema.safeParse(req.rows);
			if (error) {
				logger.error(error.issues);
				throw new z.ZodError(error.issues);
			}

			const now = new Date();
			const outdatedFeeds = data.filter((el) => {
				!el.feedLastSyncAt ||
					now.getTime() - el.feedLastSyncAt.getTime() > ONE_HOUR;
			});
			void feedService.triggerBackgroundSync(
				outdatedFeeds.map((el) => el.feedId),
			);
			return data;
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
	getLinks,
	getUserFeedsTimeline,
	getUserNewsletters,
};
