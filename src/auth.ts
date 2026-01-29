import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { usersPreferences } from "@/db/schema";
import { DEFAULT_USERS_PREFERENCES } from "@/lib/constants";
import { logger } from "@/lib/logging";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL as string,
		`https://${process.env.VERCEL_URL as string}`,
	],
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "sqlite"
		usePlural: true,
		camelCase: true,
		schema: {
			...schema,
			users: schema.users,
			sessions: schema.sessions,
			accounts: schema.accounts,
			verifications: schema.verificationTokens,
		},
	}),

	user: {
		additionalFields: {
			preferences: {
				type: "json",
				required: true,
				// defaultValue: { ...DEFAULT_USERS_PREFERENCES },
				// This determines whether a value can be provided when creating a new record (default: true).
				// If there are additional fields, like role, that should not be provided by the user during signup, you can set this to false.
				// input: false, // don't allow user to set role
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user, _ctx) => {
					logger.info("User created", { user });
					await db.insert(usersPreferences).values({
						userId: user.id,
						prefs: DEFAULT_USERS_PREFERENCES,
					});
					logger.info("Preferences created", { user });
				},
			},
		},
		account: {
			create: {
				after: async (account) => {
					logger.info("Account created", { account });
				},
			},
		},
	},
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
		github: {
			scopes: ["read:user", "user:email"],
			clientId: process.env.AUTH_GITHUB_ID as string,
			clientSecret: process.env.AUTH_GITHUB_SECRET as string,
		},
		google: {
			// https://www.better-auth.com/docs/authentication/google#always-get-refresh-tokenaccessType: "offline",
			// // Always get refresh token
			prompt: "select_account consent",
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const userPrefs = await db.query.usersPreferences.findFirst({
				where: eq(usersPreferences.userId, session.userId),
			});

			const finalPreferences = {
				...DEFAULT_USERS_PREFERENCES,
				...userPrefs?.prefs,
			};

			return {
				user: {
					...user,
					preferences: finalPreferences,
				},
				session,
			};
		}),
		// nextCookies() HAS TO BE LAST!!
		nextCookies(),
	],
});

export type BocalUserSession = typeof auth.$Infer.Session;
