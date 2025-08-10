/**
 * FeedFolder represents a feed inside a folder.
 */
export type FeedFolder = {
	// If the folder is uncategorized, the folderId will be -1.
	folderId: number;
	folderName: string | null;
	feeds: {
		id: number;
		title: string;
		url: string;
		status: FeedStatusType;
		contentsCount: number;
	}[];
};

/**
 * Represents the key for the feed folder.
 * This can either be the id of a folder or null for the uncategorized folder.
 * */
type FolderId = number;

/**
 * FeedsFolders is the structure containing feeds categorized in folders.
 */
export type FeedsFolders = Map<FolderId, FeedFolder>;

export type FeedWithContentsCount = {
	id: number;
	title: string;
	url: string;
	status: FeedStatusType;
	contentsCount: number;
};

export const UNCATEGORIZED_FEEDS_FOLDER_ID = -1;

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
