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
