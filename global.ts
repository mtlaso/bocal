// type GLOBAL_BOCAL_I18nMessagesEn = typeof import("@/../messages/en.json");
// type GLOBAL_BOCAL_I18nMessagesFr = typeof import("@/../messages/fr.json");

// type GLOBAL_BOCAL_I18nMessages = GLOBAL_BOCAL_I18nMessagesEn &
//   GLOBAL_BOCAL_I18nMessagesFr;

// declare interface IntlMessages extends GLOBAL_BOCAL_I18nMessages {}

import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";
import type messages from "./messages/en.json";

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messages;
		Formats: typeof formats;
	}
}
