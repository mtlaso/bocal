import { isFeedContentRead } from "@/app/[locale]/lib/data";
import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import "server-only";
import type { Feed } from "@/db/schema";

/**
 * Takes all feeds, removes feeds with no content,
   flattens the content into a single array
   and sorts them by date (recent to oldest).
 */
export const flattenFeedsContent = async (
	feeds: Feed[],
): Promise<FlattenedFeedsContent[]> => {
	try {
		const promiseAllItems = feeds.flatMap((feed) => {
			if (!feed?.content) return [];

			return feed.content.map(async (item) => {
				const _isRead = await isFeedContentRead(feed.id, item.id);
				return {
					...item,
					feedTitle: feed.title,
					feedId: feed.id,
					isRead: _isRead,
				} satisfies FlattenedFeedsContent;
			});
		});

		const allItems = await Promise.all(promiseAllItems);

		const orderedItems = allItems.sort((a, b) => {
			const dateA = a?.date ? new Date(a.date).getTime() : 0;
			const dateB = b?.date ? new Date(b.date).getTime() : 0;

			return dateB - dateA;
		});

		return orderedItems;
	} catch (_error) {
		throw new Error("errors.unexpected");
	}
};
