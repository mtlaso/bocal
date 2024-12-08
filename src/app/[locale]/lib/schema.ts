export enum sortOptions {
	byDateAsc = "byDateAsc",
	byDateDesc = "byDateDesc",
}

export type FeedContent = {
	items: {
		id: string;
		title: string;
		url: string;
		content: string;
		date: string;
		author?: string;
	}[];
};

export enum FeedStatus {
	ACTIVE = "active",
	ERROR = "error",
	INACTIVE = "inactive",
}

export enum FeedErrorType {
	FETCH = "fetch_error",
	PARSE = "parse_error",
	TIMEOUT = "timeout_error",
	INVALID_URL = "invalid_url",
}
