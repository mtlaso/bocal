import { SortOptions } from "@/app/[locale]/lib/types";
import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const searchParamsParsers = {
	sortLinks: parseAsStringLiteral([
		SortOptions.BY_DATE_DESC,
		SortOptions.BY_DATE_ASC,
	] as const).withDefault(SortOptions.BY_DATE_DESC),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
