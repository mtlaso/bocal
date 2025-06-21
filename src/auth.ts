import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
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
		signIn: APP_ROUTES.login,
		newUser: APP_ROUTES.dashboard,
	},
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
		authenticatorsTable: authenticators,
	}),

	callbacks: {
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
