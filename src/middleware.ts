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

export default auth((req) => {
	try {
		const langPrefix = languagePrefix(req);
		const pathname = removeLanguagePrefix(req.nextUrl.pathname);

		const isProtectedRoute = protectedRoutes.some((route) =>
			pathname.startsWith(route),
		);
		const isAuthenticated = Boolean(req.auth);
		const isAuthRequired = isProtectedRoute || pathname === "/login";
		const isLoginPage = pathname === "/login";

		if (isLoginPage && !isAuthenticated) {
			return i18nMiddleware(req);
		}

		if (isAuthenticated && isLoginPage) {
			return NextResponse.redirect(
				new URL(`${langPrefix}/dashboard`, req.nextUrl.origin),
			);
		}

		if (!isAuthenticated && isAuthRequired) {
			return NextResponse.redirect(
				new URL(`${langPrefix}/login`, req.nextUrl.origin),
			);
		}

		return i18nMiddleware(req);
	} catch (_err) {
		return NextResponse.redirect("/error");
	}
});

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
