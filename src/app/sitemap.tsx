import type { MetadataRoute } from "next";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
import { getAppBaseURL } from "@/app/[locale]/lib/get-app-base-url";
import { getPathname, type Locale, routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = Object.values(APP_ROUTES);
	return routes.map((link) => getEntry(link));
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntry(href: Href): {
	url: string;
	alternates: {
		languages: {
			[k: string]: string;
		};
	};
} {
	return {
		url: getUrl(href, routing.defaultLocale),
		alternates: {
			languages: Object.fromEntries(
				routing.locales.map((locale) => [locale, getUrl(href, locale)]),
			),
		},
	};
}

function getUrl(href: Href, locale: Locale): string {
	const pathname = getPathname({ locale, href });
	return getAppBaseURL() + pathname;
}
