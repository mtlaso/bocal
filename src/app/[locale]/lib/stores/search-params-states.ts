import { SortOptions } from "@/app/[locale]/lib/types";
import { type UrlKeys, parseAsString, parseAsStringEnum } from "nuqs/server";

const DEFAULT_FEED = "all";
const SEARCHED_LINK_KEY = "link";
const SORT_LINKS_KEY = "sort";
const SELECTED_FEED_KEY = "feed";

/**
 * searchParams contient les search params de gestion d'etat (state management).
 */
const searchParams = {
	searchedLink: parseAsString.withDefault(""),
	sortLinks: parseAsStringEnum<SortOptions>(
		Object.values(SortOptions),
	).withDefault(SortOptions.BY_DATE_DESC),
	/**
	 * Soit un ID de flux ou "all".
	 */
	selectedFeed: parseAsString.withDefault(DEFAULT_FEED),
};

/**
 * urlKeys contient les clés des search params.
 */
const urlKeys: UrlKeys<typeof searchParams> = {
	searchedLink: SEARCHED_LINK_KEY,
	sortLinks: SORT_LINKS_KEY,
	selectedFeed: SELECTED_FEED_KEY,
};

/**
 * searchParamsState permet de gérer l'état dans l'URL (state management).
 */
export const searchParamsState = {
	SEARCHED_LINK_KEY,
	SORT_LINKS_KEY,
	SELECTED_FEED_KEY,
	DEFAULT_FEED,
	searchParams,
	urlKeys,
} as const;
