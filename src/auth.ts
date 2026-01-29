import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
	// TODO: en prod sur vercel, mettre https://www.bocal.fyi
	baseURL: process.env.BETTER_AUTH_URL,
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
	hooks: {
		// before: async (ctx) => {
		// 	console.log("before hook", ctx);
		// },
		// after: async (ctx) => {
		// 	console.log("after hook", ctx);
		// },
	},
	// databaseHooks: {
	// 	user: {
	// 		create: {
	// 			before: async (data, ctx) => {
	// 				logger.info("Creating user", { data });
	// 				return { data };
	// 			},

	// 			after: async (user, ctx) => {
	// 				logger.info("User created", { user });
	// 			},
	// 		},
	// 	},
	// 	account: {
	// 		create: {
	// 			after: async (user) => {
	// 				await db.insert(usersPreferences).values({
	// 					userId: user.id,
	// 					prefs: DEFAULT_USERS_PREFERENCES,
	// 				});
	// 			},
	// 		},
	// 	},
	// 	session: {
	// 		create: {
	// 			before: async (data, ctx) => {
	// 				logger.info("Creating session", { data });
	// 				return { data };
	// 			},

	// 			after: async (session, ctx) => {
	// 				logger.info("Session created", { session });
	// 			},
	// 		},
	// 		update: {
	// 			before: async (data, ctx) => {
	// 				logger.info("Creating session", { data });
	// 				const userPrefs = await db.query.usersPreferences.findFirst({
	// 					where: eq(usersPreferences.userId, data.id!),
	// 				});
	// 				const finalPreferences = {
	// 					...DEFAULT_USERS_PREFERENCES,
	// 					...userPrefs?.prefs,
	// 				};
	// 				data.preferences = finalPreferences;
	// 				return { data };
	// 			},
	// 			after: async (session, ctx) => {
	// 				logger.info("Session updated", { session });
	// 			},
	// 		},
	// 	},
	// },
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
	// nextCookies() HAS TO BE LAST!!
	plugins: [nextCookies()],
});
