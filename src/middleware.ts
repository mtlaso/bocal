import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const PROTECTED_ROUTES = new Set(["/dashboard", "/archive", "/feed"]);
const PUBLIC_ROUTES = new Set(["/login"]);
const LANG_PREFIX_REGEX = /^\/(?:en|fr)\//;
const LOGIN_PATH = "/login";

function removeLanguagePrefix(path: string): string {
	return path.replace(LANG_PREFIX_REGEX, "/");
}

function languagePrefix(req: NextRequest): string {
	return LANG_PREFIX_REGEX.test(req.nextUrl.pathname)
		? `/${req.nextUrl.pathname.split("/")[1]}`
		: "";
}

const i18nMiddleware = createMiddleware(routing);

export default async function middleware(
	req: NextRequest,
): Promise<NextResponse> {
	const langPrefix = languagePrefix(req);
	const pathname = removeLanguagePrefix(req.nextUrl.pathname);
	const isProtectedRoute = PROTECTED_ROUTES.has(pathname);
	const isPublicRoute = PUBLIC_ROUTES.has(pathname);
	const sessionCookie = (await cookies()).get("authjs.session-token")?.value;

	/**
    Using optimistic authorization by only checking for the presence of a cookie.
    https://nextjs.org/docs/app/building-your-application/authentication#authorization
  */

	if (isProtectedRoute && !sessionCookie) {
		return NextResponse.redirect(
			new URL(`${langPrefix}${LOGIN_PATH}`, req.nextUrl.origin),
		);
	}

	if (isPublicRoute && sessionCookie) {
		return NextResponse.redirect(
			new URL(`${langPrefix}/dashboard`, req.nextUrl.origin),
		);
	}

	return i18nMiddleware(req);
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
