import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import type { Feed } from "@/db/schema";

export const flattenFeedsContent = (feeds: Feed[]): FlattenedFeedsContent[] => {
	const allItems = feeds.flatMap((feed) => {
		if (!feed?.content) return [];

		return feed.content.map((item) => {
			return {
				...item,
				feedTitle: feed.title,
				feedId: feed.id,
			} satisfies FlattenedFeedsContent;
		});
	});

	const orderedItems = allItems.sort((a, b) => {
		const dateA = a?.date ? new Date(a.date).getTime() : 0;
		const dateB = b?.date ? new Date(b.date).getTime() : 0;

		return dateB - dateA;
	});

	return orderedItems;
};
