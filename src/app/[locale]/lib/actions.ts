"use server";

import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";
import { APP_ROUTES, LENGTHS } from "@/app/[locale]/lib/constants";
import { dal } from "@/app/[locale]/lib/dal";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { logger } from "@/app/[locale]/lib/logging";
import { og } from "@/app/[locale]/lib/og";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import { signIn, signOut } from "@/auth";
import { db } from "@/db/db";
import {
	addNewsletterSchema,
	deleteLinkSchema,
	deleteNewsletterSchema,
	deleteUsersFeedsReadContentSchema,
	feeds,
	feedsContent,
	insertFeedsSchema,
	insertLinkSchema,
	insertUsersFeedsReadContentSchema,
	links,
	unfollowFeedSchema,
	usersFeeds,
	usersFeedsReadContent,
	usersPreferences,
} from "@/db/schema";

type ActionReturnType<T, E extends string = keyof T & string> = {
	/**
	 * errors contains the validation errors.
	 * Validation errors ARE translated.
	 */
	errors?: { [key in E]?: string[] };

	/**
	 * payload is the transmitted data.
	 */
	payload?: T;

	/**
	 * errI18nKey is the key of an error message to be translated.
	 * This is returning the i18n key because we cannot directly pass the translated message in some parts of the code (e.g. outside of a try/catch block).
	 * NOT TRANSLATED.
	 */
	errI18Key?: string;
	/**
	 * isSuccessful is used when an action is called through a form
	 * to know if the operation was successfull.
	 */
	isSuccessful?: boolean;
};

/**
 * authenticate authenticates a user using the specified provider. Returns the TRANSLATED error message if any.
 * @param provider - The authentication provider to use.
 */
export async function authenticate(provider: string) {
	try {
		await signIn(provider, { redirect: true });
	} catch (err) {
		logger.error(err);
		const t = await getTranslations("login");

		if (err instanceof AuthError) {
			switch (err.type) {
				case "CredentialsSignin":
					return t("errors.CredentialsSignin");
				case "OAuthSignInError":
					return t("errors.OAuthSignInError");
				case "OAuthCallbackError":
					return t("errors.OAuthCallbackError");
				case "InvalidCallbackUrl":
					return t("errors.InvalidCallbackUrl");
				case "CallbackRouteError":
					return t("errors.CallbackRouteError");
				default:
					return t("errors.unexpected");
			}
		}

		throw err;
	}
}

export async function logout(): Promise<void> {
	await signOut({ redirectTo: "/" });
}

export type AddLinkState = ActionReturnType<{
	url: string;
}>;

export async function addLink(
	_currState: AddLinkState,
	formData: FormData,
): Promise<AddLinkState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("User not defined");
		}
		const t = await getTranslations("dashboard");
		const payload = { url: formData.get("url") };
		const validatedFields = insertLinkSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					url: t("errors.urlFieldInvalid"),
				}[path];
				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { url: formData.get("url") as string },
			};
		}

		const { ogTitle, ogImageURL } = await og.scrape(validatedFields.data.url);

		await db.insert(links).values({
			url: validatedFields.data.url,
			userId: user.user.id,
			ogTitle: ogTitle,
			ogImageURL: ogImageURL,
		});
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.links);
	return { isSuccessful: true };
}

type DeleteLinkState = ActionReturnType<{
	id: number;
}>;

export async function deleteLink(id: number): Promise<DeleteLinkState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("dashboard");
		const payload = { id: id };
		const validatedFields = deleteLinkSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					id: t("errors.idFieldInvalid"),
				}[path];

				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { id: id },
			};
		}

		await db
			.delete(links)
			.where(
				and(
					eq(links.id, validatedFields.data.id),
					eq(links.userId, user.user.id),
				),
			)
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.links);
	return {};
}

export async function archiveLink(id: number): Promise<DeleteLinkState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("dashboard");
		const payload = { id: id };
		const validatedFields = deleteLinkSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					id: t("errors.idFieldInvalid"),
				}[path];

				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { id: id },
			};
		}

		await db
			.update(links)
			.set({ isArchived: true })
			.where(
				and(
					eq(links.id, validatedFields.data.id),
					eq(links.userId, user.user.id),
				),
			)
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.links);
	return {};
}

export async function unarchiveLink(id: number): Promise<DeleteLinkState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("dashboard");
		const payload = { id: id };
		const validatedFields = deleteLinkSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					id: t("errors.idFieldInvalid"),
				}[path];

				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { id: id },
			};
		}

		await db
			.update(links)
			.set({ isArchived: false })
			.where(
				and(
					eq(links.id, validatedFields.data.id),
					eq(links.userId, user.user.id),
				),
			)
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.archive);
	return {};
}

export type AddFeedState = ActionReturnType<{
	url: string;
}>;

export async function addFeed(
	_currState: AddFeedState,
	formData: FormData,
): Promise<AddFeedState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("rssFeed");

		const payload = { url: formData.get("url") };
		const validatedFields = insertFeedsSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					url: t("errors.urlFieldInvalid"),
				}[path];
				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { url: formData.get("url") as string },
			};
		}

		let isFeedsLimitReached = false;
		let isFeedAlreadyFollowed = false;

		await db.transaction(async (tx) => {
			const userFeeds = await tx.query.usersFeeds.findMany({
				where: eq(usersFeeds.userId, user.user.id),
			});

			if (userFeeds.length >= LENGTHS.feeds.maxPerUser) {
				isFeedsLimitReached = true;
				return;
			}

			let feed = await tx.query.feeds.findFirst({
				where: eq(feeds.url, validatedFields.data.url),
			});

			// IMPORTANT
			// Do not remove URL parameters when checking for duplicates such as 'example.com/feed' and 'example.com/feed?some_data=...'.
			// Some feeds may require the parameters and return content that changes the feed content.
			if (!feed) {
				const { content, title } = await feedService.parse(
					validatedFields.data.url,
				);

				const newFeed = await tx
					.insert(feeds)
					.values({
						url: validatedFields.data.url,
						title,
						lastSyncAt: new Date(),
					})
					.returning();

				feed = newFeed[0];

				await tx.insert(feedsContent).values(
					content.map((c) => ({
						feedId: newFeed[0].id,
						url: c.url,
						title: c.title,
						content: c.content,
						date: new Date(c.date),
					})),
				);

				await tx.insert(usersFeeds).values({
					userId: user.user.id,
					feedId: feed.id,
				});

				return;
			}

			// Check if the user already follows this feed.
			const existingUserFeed = await tx
				.select({
					userId: usersFeeds.userId,
					feedId: usersFeeds.feedId,
				})
				.from(usersFeeds)
				.where(
					and(
						eq(usersFeeds.userId, user.user.id),
						eq(usersFeeds.feedId, feed.id),
					),
				);

			if (existingUserFeed.length > 0) {
				isFeedAlreadyFollowed = true;
				return;
			}

			await tx.insert(usersFeeds).values({
				userId: user.user.id,
				feedId: feed.id,
			});
		});

		if (isFeedAlreadyFollowed) {
			return {
				errI18Key: "errors.feedAlreadyFollowed",
			};
		}

		if (isFeedsLimitReached) {
			return {
				errI18Key: "errors.maxFeedsReached",
			};
		}
	} catch (err) {
		logger.error(err);
		if (err instanceof feedService.FeedUnreachable) {
			return {
				errI18Key: "errors.feedUnreachable",
			};
		}

		if (err instanceof feedService.FeedCannotBeProcessed) {
			return {
				errI18Key: "errors.feedCannotBeProcessed",
			};
		}

		if (err instanceof feedService.FeedTimeout) {
			return {
				errI18Key: "errors.feedTimeout",
			};
		}

		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {
		isSuccessful: true,
	};
}

export type UnfollowFeedState = ActionReturnType<{
	feedId: number;
}>;

export async function unfollowFeed(id: number): Promise<UnfollowFeedState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("rssFeed");

		const payload = { feedId: id };
		const validatedFields = unfollowFeedSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					feedId: t("errors.idFieldInvalid"),
				}[path];
				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { feedId: id },
			};
		}

		await db.transaction(async (tx) => {
			await tx
				.delete(usersFeeds)
				.where(
					and(
						eq(usersFeeds.userId, user.user.id),
						eq(usersFeeds.feedId, validatedFields.data.feedId),
					),
				)
				.execute();

			await tx
				.delete(usersFeedsReadContent)
				.where(
					and(
						eq(usersFeedsReadContent.userId, user.user.id),
						eq(usersFeedsReadContent.feedId, validatedFields.data.feedId),
					),
				)
				.execute();
		});
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {};
}

export type MarkFeedContentAsReadState = ActionReturnType<{
	feedId: number;
	feedContentId: number;
}>;

export async function markFeedContentAsRead(
	feedId: number,
	feedContentId: number,
): Promise<MarkFeedContentAsReadState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("rssFeed");
		const payload = { feedId, feedContentId };

		const validatedFields = insertUsersFeedsReadContentSchema.safeParse(
			payload,
			{
				error: (iss) => {
					const path = iss.path?.join(".");
					if (!path) {
						return { message: t("errors.unexpected") };
					}

					const message = {
						feedId: t("errors.idFieldInvalid"),
						feedContentId: t("errors.feedContentIdFieldInvalid"),
					}[path];

					return { message: message ?? t("errors.unexpected") };
				},
			},
		);

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { feedId, feedContentId },
			};
		}

		await db
			.insert(usersFeedsReadContent)
			.values({
				userId: user.user.id,
				feedId: validatedFields.data.feedId,
				feedContentId: validatedFields.data.feedContentId,
				readAt: new Date(),
			})
			.onConflictDoNothing()
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {};
}

export type MarkFeedContentAsUnreadState = ActionReturnType<{
	feedId: number;
	feedContentId: number;
}>;

export async function markFeedContentAsUnread(
	feedId: number,
	feedContentId: number,
): Promise<MarkFeedContentAsUnreadState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("rssFeed");
		const payload = { feedId, feedContentId };
		const validatedFields = deleteUsersFeedsReadContentSchema.safeParse(
			payload,
			{
				error: (iss) => {
					const path = iss.path?.join(".");
					if (!path) {
						return { message: t("errors.unexpected") };
					}

					const message = {
						feedId: t("errors.idFieldInvalid"),
						feedContentId: t("errors.feedContentIdFieldInvalid"),
					}[path];

					return { message: message ?? t("errors.unexpected") };
				},
			},
		);

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { feedId, feedContentId },
			};
		}

		await db
			.delete(usersFeedsReadContent)
			.where(
				and(
					eq(usersFeedsReadContent.userId, user.user.id),
					eq(usersFeedsReadContent.feedId, validatedFields.data.feedId),
					eq(
						usersFeedsReadContent.feedContentId,
						validatedFields.data.feedContentId,
					),
				),
			)
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {};
}

export type SetFeedContentLimitState = ActionReturnType<{
	feedContentLimit: number;
}>;

export async function setFeedContentLimit(
	feedContentLimit: number,
): Promise<SetFeedContentLimitState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("settings.viewSection");
		const validatedFields = z
			.object({
				feedContentLimit: z
					.number()
					.min(1, {
						error: t("errors.feedContentLimitFieldInvalid"),
					})
					.max(LENGTHS.feeds.maxPerUser, {
						error: t("errors.feedContentLimitFieldInvalid"),
					}),
			})
			.safeParse({ feedContentLimit });

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { feedContentLimit },
			};
		}

		await db
			.update(usersPreferences)
			.set({
				prefs: sql`jsonb_set(prefs, '{feedContentLimit}', ${validatedFields.data.feedContentLimit})`,
			})
			.where(eq(usersPreferences.userId, user.user.id))
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.settings);
	return {};
}

export type SetHideReadFeedContentState = ActionReturnType<{
	hideRead: boolean;
}>;

export async function setHideReadFeedContent(
	hideRead: boolean,
): Promise<SetHideReadFeedContentState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const validatedFields = z
			.object({
				hideRead: z.boolean(),
			})
			.safeParse({ hideRead });

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { hideRead: hideRead },
			};
		}

		await db
			.update(usersPreferences)
			.set({
				prefs: sql`jsonb_set(prefs, '{hideReadFeedContent}', ${hideRead})`,
			})
			.where(eq(usersPreferences.userId, user.user.id))
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.settings);
	return {};
}

export type ArchiveFeedContentState = ActionReturnType<{
	url: string;
}>;

// This function is exactly the same as the one to add a link (AddLink).
// The only difference is the endpoint to revalidate the path and the archiving.
// They are seperated just in case.
export async function archiveFeedContent(
	url: string,
): Promise<ArchiveFeedContentState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("dashboard");
		const payload = { url: url };
		const validatedFields = insertLinkSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					url: t("errors.urlFieldInvalid"),
				}[path];
				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { url: url },
			};
		}

		const { ogTitle, ogImageURL } = await og.scrape(validatedFields.data.url);

		await db.insert(links).values({
			url: validatedFields.data.url,
			userId: user.user.id,
			ogTitle: ogTitle,
			ogImageURL: ogImageURL,
			isArchived: true,
		});
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.archive);
	return {};
}

export type AddNewsletterState = ActionReturnType<{
	title: string;
}>;

export async function addNewsletter(
	_currState: AddNewsletterState,
	formData: FormData,
): Promise<AddNewsletterState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("newsletter");
		const payload = { title: formData.get("title") as string };
		const validatedFields = addNewsletterSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				if (iss.code === "too_small") {
					return { message: t("errors.titleFieldTooShort") };
				}

				if (iss.code === "too_big") {
					return { message: t("errors.titleFieldTooLong") };
				}

				const message = {
					title: t("errors.titleFieldInvalid"),
				}[path];

				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errors: z.flattenError(validatedFields.error).fieldErrors,
				payload: { title: formData.get("title") as string },
			};
		}

		// Check if the user has reached the maximum number of feeds.
		const userFeeds = await db.query.usersFeeds.findMany({
			where: eq(usersFeeds.userId, user.user.id),
		});
		if (userFeeds.length >= LENGTHS.feeds.maxPerUser) {
			return {
				errI18Key: "errors.maxFeedsReached",
			};
		}

		const eid = randomUUID();
		const feed = await db
			.insert(feeds)
			.values({
				eid,
				newsletterOwnerId: user.user.id,
				url: `${userfeedsfuncs.NEWSLETTER_URL_PREFIX}${eid}`,
				title: validatedFields.data.title,
				lastSyncAt: new Date(),
			})
			.returning();

		await db.insert(usersFeeds).values({
			userId: user.user.id,
			feedId: feed[0].id,
		});
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.newsletters);
	return {
		isSuccessful: true,
	};
}

export type DeleteNewsletterState = ActionReturnType<{
	id: number;
}>;

export async function deleteNewsletter(
	id: number,
): Promise<DeleteNewsletterState> {
	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("not signed in");
		}

		const t = await getTranslations("newsletter");
		const payload = { id };
		const validatedFields = deleteNewsletterSchema.safeParse(payload, {
			error: (iss) => {
				const path = iss.path?.join(".");
				if (!path) {
					return { message: t("errors.unexpected") };
				}

				const message = {
					id: t("errors.idFieldInvalid"),
				}[path];

				return { message: message ?? t("errors.unexpected") };
			},
		});

		if (!validatedFields.success) {
			return {
				errI18Key: "errors.missingFields",
				errors: z.flattenError(validatedFields.error).fieldErrors,
			};
		}

		await db
			.delete(feeds)
			.where(
				and(
					eq(feeds.id, validatedFields.data.id),
					eq(feeds.newsletterOwnerId, user.user.id),
				),
			);
	} catch (err) {
		logger.error(err);
		return {
			errI18Key: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.newsletters);
	return {};
}
