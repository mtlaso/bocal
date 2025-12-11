import type { Formats, Locale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// getRequestConfig creates a request-scoped configuration object,
// which is used to provide messages and other options
// based on the user’s locale to Server Components.
export default getRequestConfig(async (config) => {
	let locale = await config.requestLocale;

	if (
		!locale ||
		!routing.locales.includes(locale as (typeof routing.locales)[number])
	) {
		locale = routing.defaultLocale;
	}

	// This is used to pass the correct type.
	const realLocale = locale as Locale;

	return {
		locale: realLocale,
		messages: (await import(`../../messages/${locale}.json`)).default,
		// formats: formats,
	};
});

export const formats: Formats = {
	dateTime: {
		short: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	number: {
		precise: {
			maximumFractionDigits: 5,
		},
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction",
		},
	},
};
