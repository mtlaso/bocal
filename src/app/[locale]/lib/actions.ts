"use server";

import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
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
	insertLinksSchema,
	insertUsersFeedsReadContentSchema,
	links,
	unfollowFeedSchema,
	usersFeeds,
	usersFeedsReadContent,
	usersPreferences,
} from "@/db/schema";

type State<T, E extends string = keyof T & string> = {
	errors?: { [key in E]?: string[] };
	data?: T;
	defaultErrMessage?: string | null;
	successMessage?: string | null;
};

export async function authenticate(
	provider: string,
): Promise<string | undefined> {
	let redirectUrl: null | string = null;
	try {
		redirectUrl = await signIn(provider, { redirect: false });
	} catch (err) {
		logger.error(err);
		if (err instanceof AuthError) {
			switch (err.message) {
				case "CredentialsSignin":
					return "errors.CredentialsSignin";
				case "OAuthSignInError":
					return "errors.OAuthSignInError";
				case "OAuthCallbackError":
					return "errors.OAuthCallbackError";
				case "InvalidCallbackUrl":
					return "errors.InvalidCallbackUrl";
				case "CallbackRouteError":
					return "errors.CallbackRouteError";
				default:
					return "errors.default";
			}
		}

		throw err;
	}

	if (redirectUrl) {
		// 'redirect' ne peut pas être utilisé dans un try-catch.
		redirect(redirectUrl);
	}
}

export async function logout(): Promise<void> {
	await signOut({ redirectTo: "/" });
}

export type AddLinkState = State<{
	url?: string;
}>;

export async function addLink(
	_currState: AddLinkState,
	formData: FormData,
): Promise<AddLinkState> {
	const validatedFields = insertLinksSchema.safeParse({
		url: formData.get("url"),
	});

	if (!validatedFields.success) {
		logger.info("Validation failed", validatedFields.error);
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { url: formData.get("url")?.toString() },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
			errors: undefined,
		};
	}

	revalidatePath(APP_ROUTES.links);
	return {};
}

type DeleteLinkState = State<{
	id?: number;
}>;

export async function deleteLink(id: number): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: id,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { id: id },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.links);
	return {};
}

export async function archiveLink(id: number): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: id,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { id: id },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.links);
	return {};
}

export async function unarchiveLink(id: number): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: id,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { id: id },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.archive);
	return {};
}

export type AddFeedState = State<{
	url?: string;
}>;

export async function addFeed(
	_currState: AddFeedState,
	formData: FormData,
): Promise<AddFeedState> {
	const validatedFields = insertFeedsSchema.safeParse({
		url: formData.get("url"),
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { url: formData.get("url")?.toString() },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		let isMaxFeedsLimit = false;
		let isFeedAlreadyFollowed = false;

		await db.transaction(async (tx) => {
			const userFeeds = await tx.query.usersFeeds.findMany({
				where: eq(usersFeeds.userId, user.user.id),
			});

			if (userFeeds.length >= LENGTHS.feeds.maxPerUser) {
				isMaxFeedsLimit = true;
				return;
			}

			let feed = await tx.query.feeds.findFirst({
				where: eq(feeds.url, validatedFields.data.url),
			});

			// IMPORTANT
			// Ne pas retier les params des URL pour vérifier si des duplications existent comme 'example.com/feed et 'example.com/feed?some_data=...'.
			// Certains flux peuvent avoir besoin des params et retourner du contenu qui changent le contenu du flux.
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

			// Vérifier si l'utilisateur suit ce flux seulement si le flux existe déjà.
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
				defaultErrMessage: "errors.feedAlreadyFollowed",
				errors: undefined,
			};
		}

		if (isMaxFeedsLimit) {
			return {
				defaultErrMessage: "errors.maxFeedsReached",
				errors: undefined,
			};
		}
	} catch (err) {
		logger.error(err);
		if (err instanceof feedService.FeedUnreachable) {
			return {
				defaultErrMessage: "errors.feedUnreachable",
				errors: undefined,
			};
		}

		if (err instanceof feedService.FeedCannotBeProcessed) {
			return {
				defaultErrMessage: "errors.feedCannotBeProcessed",
				errors: undefined,
			};
		}

		return {
			defaultErrMessage: "errors.unexpected",
			errors: undefined,
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {
		successMessage: "success",
	};
}

export type UnfollowFeedState = State<{
	feedId?: number;
}>;

export async function unfollowFeed(id: string): Promise<UnfollowFeedState> {
	const validatedFields = unfollowFeedSchema.safeParse({
		feedId: Number.parseInt(id),
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { feedId: Number.parseInt(id) },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {
		successMessage: "successUnfollow",
	};
}

export type MarkFeedContentAsReadState = State<{
	feedId?: number;
	feedContentId?: number;
}>;

export async function markFeedContentAsRead(
	feedId: number,
	feedContentId: number,
): Promise<MarkFeedContentAsReadState> {
	const validatedFields = insertUsersFeedsReadContentSchema.safeParse({
		feedId,
		feedContentId,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { feedId, feedContentId },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {};
}

export type MarkFeedContentAsUnreadState = State<{
	feedId?: number;
	feedContentId?: number;
}>;

export async function markFeedContentAsUnread(
	feedId: number,
	feedContentId: number,
): Promise<MarkFeedContentAsUnreadState> {
	const validatedFields = deleteUsersFeedsReadContentSchema.safeParse({
		feedId,
		feedContentId,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { feedId, feedContentId },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.feeds);
	return {};
}

export type SetFeedContentLimitState = State<{
	feedContentLimit: number;
}>;

export async function setFeedContentLimit(
	feedContentLimit: number,
): Promise<SetFeedContentLimitState> {
	const validatedFields = z
		.object({
			feedContentLimit: z
				.number()
				.min(1, {
					error: "errors.feedContentLimitFieldInvalid",
				})
				.max(LENGTHS.feeds.maxPerUser, {
					error: "errors.feedContentLimitFieldInvalid",
				}),
		})
		.safeParse({ feedContentLimit });

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { feedContentLimit },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.settings);
	return {};
}

export type SetHideReadFeedContentState = State<{
	hideRead: boolean;
}>;

export async function setHideReadFeedContent(
	hideRead: boolean,
): Promise<SetHideReadFeedContentState> {
	const validatedFields = z
		.object({
			hideRead: z.boolean(),
		})
		.safeParse({ hideRead });

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { hideRead: hideRead },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const val = String(validatedFields.data.hideRead);
		await db
			.update(usersPreferences)
			.set({
				prefs: sql`jsonb_set(prefs, '{hideReadFeedContent}', ${val})`,
			})
			.where(eq(usersPreferences.userId, user.user.id))
			.execute();
	} catch (err) {
		logger.error(err);
		return {
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.settings);
	return {};
}

export type ArchiveFeedContentState = State<{
	url: string;
}>;

// This function is exactly the same as the one to add a link (AddLink).
// The only difference is the endpoint to revalidate the path and the archiving.
// They are seperated just in case.
export async function archiveFeedContent(
	url: string,
): Promise<ArchiveFeedContentState> {
	const validatedFields = insertLinksSchema.safeParse({
		url: url,
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { url: url },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.archive);
	return { successMessage: "success" };
}

export type AddNewsletterState = State<{
	title?: string;
}>;

export async function addNewsletter(
	_currState: AddNewsletterState,
	formData: FormData,
): Promise<AddNewsletterState> {
	const validatedFields = addNewsletterSchema.safeParse({
		title: formData.get("title"),
	});

	if (!validatedFields.success) {
		return {
			errors: z.flattenError(validatedFields.error).fieldErrors,
			data: { title: formData.get("title")?.toString() },
			defaultErrMessage: "errors.missingFields",
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const userFeeds = await db.query.usersFeeds.findMany({
			where: eq(usersFeeds.userId, user.user.id),
		});

		if (userFeeds.length >= LENGTHS.feeds.maxPerUser) {
			return {
				defaultErrMessage: "errors.maxFeedsReached",
				errors: undefined,
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.newsletters);
	return {
		successMessage: "success",
	};
}

export type DeleteNewsletterState = State<{
	id: number;
}>;

export async function deleteNewsletter(
	id: number,
): Promise<DeleteNewsletterState> {
	const validatedFields = deleteNewsletterSchema.safeParse({
		id,
	});

	if (!validatedFields.success) {
		return {
			defaultErrMessage: "errors.missingFields",
			errors: z.flattenError(validatedFields.error).fieldErrors,
		};
	}

	try {
		const user = await dal.verifySession();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		// We don't check if there is a relationship in users_feeds because
		// a user could have unfollowed the feed but still have access to it
		// though the newsletter page.
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
			defaultErrMessage: "errors.unexpected",
		};
	}

	revalidatePath(APP_ROUTES.newsletters);
	return {};
}
