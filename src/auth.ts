import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import {
	APP_ROUTES,
	DEFAULT_USERS_PREFERENCES,
} from "@/app/[locale]/lib/constants";
import { logger } from "@/app/[locale]/lib/logging";
import { db } from "./db/db";
import {
	accounts,
	authenticators,
	sessions,
	users,
	usersPreferences,
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
			preferences: typeof DEFAULT_USERS_PREFERENCES;
		} & DefaultSession["user"];
	}
}

const config = {
	providers: [GitHub, Google],
	pages: {
		signIn: APP_ROUTES.login,
		newUser: APP_ROUTES.links,
	},
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
		authenticatorsTable: authenticators,
	}),

	callbacks: {
		async session({ session, user }) {
			const userPrefs = await db.query.usersPreferences.findFirst({
				where: eq(usersPreferences.userId, user.id),
			});

			// In case some users don't have preferences yet (created before this feature).
			const finalPrefrences = {
				...DEFAULT_USERS_PREFERENCES,
				...userPrefs?.prefs,
			};

			session.user.id = user.id;
			session.user.preferences = finalPrefrences;
			return session;
		},
	},

	events: {
		async createUser({ user }) {
			if (user.id) {
				await db.insert(usersPreferences).values({
					userId: user.id,
					prefs: DEFAULT_USERS_PREFERENCES,
				});
			} else {
				logger.warn("User ID is not defined in auth.ts > createUser", user);
			}
		},
	},
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
