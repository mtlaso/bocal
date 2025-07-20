import { parseAsString, parseAsStringEnum, type UrlKeys } from "nuqs/server";
import { SortOptions } from "@/app/[locale]/lib/types";

const DEFAULT_FEED = "all";
const SEARCHED_LINK_KEY = "link";
const SORT_LINKS_KEY = "sort";
const SELECTED_FEED_KEY = "feed";

/**
 * searchParams has the keys of search params.
 */
const searchParams = {
	searchedLink: parseAsString.withDefault(""),
	sortLinks: parseAsStringEnum<SortOptions>(
		Object.values(SortOptions),
	).withDefault(SortOptions.BY_DATE_DESC),
	/**
	 * Could either be an ID of a feed or "all".
	 */
	selectedFeed: parseAsString.withDefault(DEFAULT_FEED),
};

/**
 * urlKeys has the keys of search params.
 */
const urlKeys: UrlKeys<typeof searchParams> = {
	searchedLink: SEARCHED_LINK_KEY,
	sortLinks: SORT_LINKS_KEY,
	selectedFeed: SELECTED_FEED_KEY,
};

/**
 * searchParamsState handles the app state in the URL (state management).
 */
export const searchParamsState = {
	SEARCHED_LINK_KEY,
	SORT_LINKS_KEY,
	SELECTED_FEED_KEY,
	DEFAULT_FEED,
	searchParams,
	urlKeys,
} as const;
