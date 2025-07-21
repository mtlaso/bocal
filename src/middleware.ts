import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
import { COOKIE_NAMES } from "@/app/[locale]/lib/constants";
import { routing } from "./i18n/routing";

const PROTECTED_ROUTES: ReadonlySet<string> = new Set([
	APP_ROUTES.links,
	APP_ROUTES.archive,
	APP_ROUTES.feeds,
	APP_ROUTES.newsletters,
	APP_ROUTES.settings,
]);
const PUBLIC_ROUTES = new Set(["/", APP_ROUTES.login]);
const LANG_PREFIX_REGEX = /^\/(?:en|fr)\//;
const LOGIN_PATH = APP_ROUTES.login;

function removeLanguagePrefix(path: string): string {
	return path.replace(LANG_PREFIX_REGEX, "/");
}

function getLanguagePrefix(req: NextRequest): string {
	return LANG_PREFIX_REGEX.test(req.nextUrl.pathname)
		? `/${req.nextUrl.pathname.split("/")[1]}`
		: "";
}

function getSessionCookieName(): string {
	// See next-auth/packages/core/src/lib/utils/cookie.ts (on github).
	// https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/utils/cookie.ts#L59
	const cookieName = "authjs.session-token";
	// If the environment is Vercel, the cookie name must be prefixed with `__Secure-` (production)
	if (process.env.VERCEL_ENV) {
		return `__Secure-${cookieName}`;
	}

	return cookieName;
}

const i18nMiddleware = createMiddleware(routing);

export default async function middleware(
	req: NextRequest,
): Promise<NextResponse> {
	const langPrefix = getLanguagePrefix(req);
	const pathname = removeLanguagePrefix(req.nextUrl.pathname);
	const isProtectedRoute = PROTECTED_ROUTES.has(pathname);
	const isPublicRoute = PUBLIC_ROUTES.has(pathname);

	const cookieStore = await cookies();
	const sessCookieName = getSessionCookieName();
	const sessionCookie = cookieStore.get(sessCookieName)?.value;

	// Add the pathname to a cookie so it can be accessed in server components (such as /d/feeds sidebar).
	cookieStore.set(COOKIE_NAMES.currentPathname, pathname);

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
			new URL(`${langPrefix}${APP_ROUTES.links}`, req.nextUrl.origin),
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
