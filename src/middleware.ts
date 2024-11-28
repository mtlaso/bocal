import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

const protectedRoutes = ["/dashboard"];

function removeLanguagePrefix(path: string): string {
	const langPrefixRegex = /^\/(?:en|fr)\//;
	return path.replace(langPrefixRegex, "/");
}

export async function middleware(
	req: NextRequest,
): Promise<NextResponse<unknown>> {
	const pathnameWithoutLang = removeLanguagePrefix(req.nextUrl.pathname);

	const authRes = await auth();
	if (!authRes) {
		const isProtectedRoute = protectedRoutes.some((route) =>
			pathnameWithoutLang.startsWith(route),
		);

		if (isProtectedRoute) {
			const langPrefix = /^\/(?:en|fr)\//.test(req.nextUrl.pathname)
				? `/${req.nextUrl.pathname.split("/")[1]}`
				: "";
			return NextResponse.redirect(new URL(`${langPrefix}/login`, req.url));
		}
	}

	if (authRes && pathnameWithoutLang === "/login") {
		const langPrefix = /^\/(?:en|fr)\//.test(req.nextUrl.pathname)
			? `/${req.nextUrl.pathname.split("/")[1]}`
			: "";
		return NextResponse.redirect(new URL(`${langPrefix}/dashboard`, req.url));
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
