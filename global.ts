import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";
import type messagesEn from "./messages/en.json";
import type messagesFr from "./messages/fr.json";

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messagesEn & typeof messagesFr;
		Formats: typeof formats;
	}
}
