export enum SortOptions {
	BY_DATE_ASC = "byDateAsc",
	BY_DATE_DESC = "byDateDesc",
}

export enum FeedStatusType {
	ACTIVE = "active",
	ERROR = "error",
	INACTIVE = "inactive",
}

export enum FeedErrorType {
	FETCH = "fetch_error",
	PARSE = "parse_error",
	TIMEOUT = "timeout_error",
	INVALID_URL = "invalid_url",
	UNKNOWN = "unknown_error",
}

/**
 * LENGTHS contient les longueurs de champs.
 */
export const LENGTHS = {
	feeds: {
		maxPerUser: 100,
	},
	newsletters: {
		title: {
			min: 2,
			max: 100,
		},
	},
} as const;
