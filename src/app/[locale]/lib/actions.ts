"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(provider: string) {
	try {
		await signIn(provider, { redirectTo: "/" });
	} catch (err) {
		if (err instanceof AuthError) {
			switch (err.type) {
				case "CredentialsSignin":
					return "error.CredentialsSignin";
				case "OAuthSignInError":
					return "error.OAuthSignInError";
				case "OAuthCallbackError":
					return "error.OAuthCallbackError";
				case "InvalidCallbackUrl":
					return "error.InvalidCallbackUrl";
				case "CallbackRouteError":
					return "error.CallbackRouteError";
				default:
					return "error.default";
			}
		}

		throw err;
	}
}
