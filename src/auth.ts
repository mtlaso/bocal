import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db/db";

const config = {
	providers: [GitHub, Google],
	pages: {
		signIn: "/login",
	},
	adapter: DrizzleAdapter(db),
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
