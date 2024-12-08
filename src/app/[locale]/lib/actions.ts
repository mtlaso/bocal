"use server";

import { feedService } from "@/app/[locale]/lib/feed-service";
import { ogScrape } from "@/app/[locale]/lib/og-scrape";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db/db";
import {
	deleteLinkSchema,
	feeds,
	insertFeedsSchema,
	insertLinksSchema,
	links,
	usersFeeds,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function authenticate(
	provider: string,
): Promise<string | undefined> {
	try {
		await signIn(provider, { redirectTo: "/login" });
	} catch (err) {
		if (err instanceof AuthError) {
			switch (err.type) {
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
}

export async function logout(): Promise<void> {
	await signOut({ redirectTo: "/" });
}

export type AddLinkState = {
	errors?: {
		url?: string[];
	};
	data?: {
		url?: string;
	};
	message?: string | null;
};

export async function addLink(
	_currState: AddLinkState,
	formData: FormData,
): Promise<AddLinkState> {
	const validatedFields = insertLinksSchema.safeParse({
		url: formData.get("url"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			data: { url: formData.get("url")?.toString() },
			message: "errors.missingFields",
		};
	}

	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const { ogTitle, ogImageURL } = await ogScrape(validatedFields.data.url);

		await db.insert(links).values({
			url: validatedFields.data.url,
			userId: user.user.id,
			ogTitle: ogTitle,
			ogImageURL: ogImageURL,
		});
	} catch (_err) {
		return {
			message: "errors.unexpected",
			errors: undefined,
		};
	}

	revalidatePath("/dashboard");
	return {};
}

type DeleteLinkState = {
	errors?: {
		id?: string[];
	};

	data?: {
		id?: number;
	};

	message?: string | null;
};

export async function deleteLink(id: string): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: Number.parseInt(id),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			data: { id: Number.parseInt(id) },
			message: "errors.missingFields",
		};
	}

	try {
		const user = await auth();
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
	} catch (_err) {
		return {
			message: "errors.unexpected",
		};
	}

	revalidatePath("/dashboard");
	return {};
}

export async function archiveLink(id: string): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: Number.parseInt(id),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			data: { id: Number.parseInt(id) },
			message: "errors.missingFields",
		};
	}

	try {
		const user = await auth();
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
	} catch (_err) {
		return {
			message: "errors.unexpected",
		};
	}

	revalidatePath("/dashboard");
	return {};
}

export async function unarchiveLink(id: string): Promise<DeleteLinkState> {
	const validatedFields = deleteLinkSchema.safeParse({
		id: Number.parseInt(id),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			data: { id: Number.parseInt(id) },
			message: "errors.missingFields",
		};
	}

	try {
		const user = await auth();
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
	} catch (_err) {
		return {
			message: "errors.unexpected",
		};
	}

	revalidatePath("/archive");
	return {};
}

export type AddFeedState = {
	errors?: {
		url?: string[];
	};
	data?: {
		url?: string;
	};
	message?: string | null;
	successMessage?: string | null;
};

export async function addFeed(
	_currState: AddFeedState,
	formData: FormData,
): Promise<AddFeedState> {
	const validatedFields = insertFeedsSchema.safeParse({
		url: formData.get("url"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			data: { url: formData.get("url")?.toString() },
			message: "errors.missingFields",
		};
	}

	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		let isFeedAlreadyFollowed = false;

		await db.transaction(async (tx) => {
			let feed = await tx.query.feeds.findFirst({
				where: eq(feeds.url, validatedFields.data.url),
			});

			// If the feed does not exist, add it.
			// And fetch the feed content.
			if (!feed) {
				const res = await feedService.fetchFeed(validatedFields.data.url);
				const xml = await res.text();
				const content = await feedService.parseFeed(xml);

				const newFeed = await tx
					.insert(feeds)
					.values({
						url: validatedFields.data.url,
						title: content.items[0].title,
						lastSyncAt: new Date(),
						content: content,
					})
					.returning();

				feed = newFeed[0];
			}

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
				message: "errors.feedAlreadyFollowed",
				errors: undefined,
			};
		}
	} catch (err) {
		if (err instanceof feedService.UrlNotAFeed) {
			return {
				message: "errors.urlNotAFeed",
				errors: undefined,
			};
		}

		if (err instanceof feedService.FeedTooLarge) {
			return {
				message: "errors.feedTooLarge",
				errors: undefined,
			};
		}

		if (err instanceof feedService.FeedUnreachable) {
			return {
				message: "errors.feedUnreachable",
				errors: undefined,
			};
		}

		if (err instanceof feedService.FeedMalformed) {
			return {
				message: "errors.feedMalformed",
				errors: undefined,
			};
		}

		if (err instanceof feedService.FeedCannotBeProcessed) {
			return {
				message: "errors.feedCannotBeProcessed",
				errors: undefined,
			};
		}

		return {
			message: "errors.unexpected",
			errors: undefined,
		};
	}

	revalidatePath("/feed");
	return {
		successMessage: "success",
	};
}
