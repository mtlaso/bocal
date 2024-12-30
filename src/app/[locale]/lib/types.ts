import type { UsersFeedsReadContent } from "@/db/schema";
import type { Locales } from "@/i18n/routing";

export enum SortOptions {
	BY_DATE_ASC = "byDateAsc",
	BY_DATE_DESC = "byDateDesc",
}

export type FeedContent = {
	id: string;
	title: string;
	url: string;
	content: string;
	date: string;
};

export type FlattenedFeedsContent = FeedContent & {
	feedTitle: string;
	feedId: number;
	isRead: UsersFeedsReadContent | null;
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

export type PrivacyPolicyData = {
	projectName: string;
	lastUpdated: string;
	siteUrl: string;
	collectedInformation: {
		[key in Locales]: string[];
	};
};
