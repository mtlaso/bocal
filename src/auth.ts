import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthConfig, type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db/db";
import {
	accounts,
	authenticators,
	sessions,
	users,
	verificationTokens,
} from "./db/schema";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id: string;
			feedContentLimit: number;
		} & DefaultSession["user"];
	}
}

const config = {
	providers: [GitHub, Google],
	pages: {
		signIn: "/login",
		newUser: "/dashboard",
	},
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
		authenticatorsTable: authenticators,
	}),

	callbacks: {
		// biome-ignore lint/nursery/useExplicitType: auth.ts
		session({ session }) {
			return {
				...session,
				user: {
					...session.user,
					id: session.user.id,
					feedContentLimit: session.user.feedContentLimit,
				},
			};
		},
	},
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
