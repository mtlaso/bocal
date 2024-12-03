"use server";

import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db/db";
import { deleteLinkSchema, insertLinksSchema, links } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { scrapePage } from "./scrape";

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

		const { ogTitle, ogImageURL } = await scrapePage(validatedFields.data.url);

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
