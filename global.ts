import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";

type Messages_BOCAL = typeof import("./messages/en.json") &
	typeof import("./messages/fr.json");

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: Messages_BOCAL;
		Formats: typeof formats;
	}
}
