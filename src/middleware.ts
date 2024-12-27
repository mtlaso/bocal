import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

const protectedRoutes = ["/dashboard", "/archive", "/feed"] as const;

function removeLanguagePrefix(path: string): string {
	const langPrefixRegex = /^\/(?:en|fr)\//;
	return path.replace(langPrefixRegex, "/");
}

function languagePrefix(req: NextRequest): string {
	return /^\/(?:en|fr)\//.test(req.nextUrl.pathname)
		? `/${req.nextUrl.pathname.split("/")[1]}`
		: "";
}

const i18nMiddleware = createMiddleware(routing);

const authMiddleware = auth((req) => {
	const langPrefix = languagePrefix(req);
	const pathnameWithoutLang = removeLanguagePrefix(req.nextUrl.pathname);

	if (req.auth) {
		if (req.nextUrl.pathname === "/login") {
			return NextResponse.redirect(
				new URL(`${langPrefix}/dashboard`, req.nextUrl.origin),
			);
		}

		return i18nMiddleware(req);
	}

	if (pathnameWithoutLang === "/login") {
		return i18nMiddleware(req);
	}

	return NextResponse.redirect(
		new URL(`${langPrefix}/login`, req.nextUrl.origin),
	);
});

export default function middleware(req: NextRequest): NextResponse {
	try {
		const pathnameWithoutLang = removeLanguagePrefix(req.nextUrl.pathname);
		const isProtectedRoute = protectedRoutes.some((route) =>
			pathnameWithoutLang.startsWith(route),
		);

		const isAuthRequired = isProtectedRoute || pathnameWithoutLang === "/login";

		// biome-ignore lint/suspicious/noExplicitAny: middleware.ts
		return isAuthRequired ? (authMiddleware as any)(req) : i18nMiddleware(req);
	} catch (_err) {
		return NextResponse.redirect("/error");
	}
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
