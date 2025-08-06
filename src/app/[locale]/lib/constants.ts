export type FeedWithContentsCount = {
	id: number;
	title: string;
	url: string;
	status: FeedStatusType;
	contentsCount: number;
};

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
 * LENGTHS contains the lengths of fields.
 */
export const LENGTHS = {
	feeds: {
		maxPerUser: 100,
		addFeedFolder: {
			name: {
				min: 2,
				max: 100,
			},
		},
	},
	newsletters: {
		title: {
			min: 2,
			max: 100,
		},
	},
} as const;

/**
 * APP_ROUTES centralizes the app routes.
 */
export const APP_ROUTES = {
	login: "/login",
	links: "/d/links",
	archive: "/d/archive",
	feeds: "/d/feeds",
	settings: "/d/settings",
	newsletters: "/d/newsletters",
	legalPrivacy: "/legal/privacy",
	legalTerms: "/legal/terms",
} as const;

/**
 * DEFAULT_USERS_PREFERENCES represents the default users preferences.
 */
export const DEFAULT_USERS_PREFERENCES = {
	hideReadFeedContent: false,
	feedContentLimit: 30,
};

export type UserPreferences = typeof DEFAULT_USERS_PREFERENCES;
// export type UserPreferencesKey = keyof typeof DEFAULT_USERS_PREFERENCES;
