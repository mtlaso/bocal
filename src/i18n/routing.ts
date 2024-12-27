import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export type Locale = (typeof routing.locales)[number];

export const routing = defineRouting({
	locales: ["en", "fr"],
	defaultLocale: "en",
	// NEEDS TO BE TO 'never'! SO OAUTH CALLBACKS WORK (by not including the /fr, /en in the URL)!
	localePrefix: "never",
});

export type Locales = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
