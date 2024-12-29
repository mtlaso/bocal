import { getAppUrl } from "@/app/[locale]/lib/get-app-url";
import { type Locale, getPathname, routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		getEntry("/"),
		getEntry("/dashboard"),
		getEntry("/archive"),
		getEntry("/feed"),
		getEntry("/login"),
	];
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
	return getAppUrl() + pathname;
}
