import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

export async function middleware(req: NextRequest) {
	const authRes = await auth();
	if (!authRes) {
		if (req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/login")
			return NextResponse.redirect(new URL("/login", req.url));
	}

	if (authRes) {
		if (req.nextUrl.pathname === "/login") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}

	const handleI18n = createMiddleware(routing);
	return handleI18n(req);
}

export const config = {
	matcher: [
		// Match only internationalized pathnames
		"/",
		"/(en|fr)/:path*",

		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		// (https://www.debuggex.com/ => if not followed by...)
		"/((?!api|_next|_vercel|.*\\..*).*)",
		// However, match all pathnames within `/users`, optionally with a locale prefix
		// "/([\\w-]+)?/users/(.+)",
	],
};
