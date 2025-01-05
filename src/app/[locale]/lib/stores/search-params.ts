import { SortOptions } from "@/app/[locale]/lib/types";
import { parseAsString, parseAsStringEnum } from "nuqs/server";

export const SELECTED_FEED_DEFAULT = "all";

export const searchParamsParsers = {
	sortLinks: parseAsStringEnum<SortOptions>(
		Object.values(SortOptions),
	).withDefault(SortOptions.BY_DATE_DESC),
	selectedFeed: parseAsString.withDefault(SELECTED_FEED_DEFAULT),
};
