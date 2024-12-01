"use server";

import { auth, signIn } from "@/auth";
import { db } from "@/db/db";
import { insertLinksSchema, links } from "@/db/schema";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import ogs from "open-graph-scraper";
import type { OpenGraphScraperOptions } from "open-graph-scraper/types";

export type AddLinkState = {
	errors?: {
		url?: string[];
	};
	data?: {
		url?: string;
	};
	message?: string | null;
};

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

		const ogOpts = {
			url: validatedFields.data.url,
		} satisfies OpenGraphScraperOptions;

		const ogReq = await ogs(ogOpts);
		const { result, error } = ogReq;
		const ogTitle = !error ? result.ogTitle : null;
		const ogImageURL = !error ? result.ogImage?.at(0)?.url : null;

		console.log(ogTitle);
		console.log(ogImageURL);

		await db.insert(links).values({
			url: validatedFields.data.url,
			userId: user.user.id,
			ogTitle: ogTitle,
			ogImageURL: ogImageURL,
		});
	} catch (_err) {
		console.log(_err);
		return {
			message: "errors.unexpected",
			errors: undefined,
		};
	}

	revalidatePath("/dashboard");
	return {};
}
