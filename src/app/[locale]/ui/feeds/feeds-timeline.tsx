"use client";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { FeedContextMenu } from "@/app/[locale]/ui/feeds/feed-context-menu";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Checkbox } from "@/components/ui/checkbox";
import type { FeedTimeline } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { markFeedContentAsRead, markFeedContentAsUnread } from "@/lib/actions";
import type { UserPreferences } from "@/lib/constants";
import { parsing } from "@/lib/parsing.client";
import { useFeedsUnereadCount } from "@/lib/stores/feeds-read-count-context";
import { searchParamsState } from "@/lib/stores/search-params-states";
import { userfeedsfuncs } from "@/lib/userfeeds-funcs";
import { cn } from "@/lib/utils";

type Props = {
	timeline: FeedTimeline[];
	userPreferences: UserPreferences;
};

export function FeedsTimeline({
	timeline,
	userPreferences,
}: Props): React.JSX.Element {
	const [{ selectedFeed }] = useQueryStates(searchParamsState.searchParams, {
		urlKeys: searchParamsState.urlKeys,
	});

	const feedUnreadCounts: Map<number, number> = new Map();
	for (const item of timeline) {
		if (item.readAt === null) {
			feedUnreadCounts.set(
				item.feedId,
				(feedUnreadCounts.get(item.feedId) ?? 0) + 1,
			);
		}
	}

	const items = timeline
		.filter((el) => {
			if (selectedFeed === searchParamsState.DEFAULT_FEED) return true;
			return el.feedId.toString() === selectedFeed;
		})
		.filter((el) => {
			if (userPreferences.hideReadFeedContent && el.readAt !== null)
				return false;
			return true;
		})
		.slice(0, userPreferences.feedContentLimit);

	return (
		<section className={cn("wrap-anywhere", SPACING.LG)}>
			{items.map((item) => {
				return (
					<Item
						item={item}
						feedUnreadCounts={feedUnreadCounts.get(item.feedId) ?? 0}
						key={`${item.id}`}
					/>
				);
			})}
		</section>
	);
}

const Item = ({
	item,
	feedUnreadCounts,
}: {
	item: FeedTimeline;
	/**
	 * feedUnreadCounts is the initial number of items left to read in a feed.
	 * Used for optimistic updates to sync with the sidebar through the context.
	 */
	feedUnreadCounts: number;
}): React.JSX.Element => {
	const t = useTranslations("rssFeed");
	const locale = useLocale();

	const [isRead, setIsRead] = useOptimistic(item.readAt !== null);
	const feedsReadCount = useFeedsUnereadCount();

	const handleMarkAsRead = async (
		feedId: number,
		feedContentId: number,
	): Promise<void> => {
		feedsReadCount.setOptimisticUnread(
			feedId,
			feedUnreadCounts - 1,
			feedUnreadCounts,
		);

		startTransition(async () => {
			try {
				setIsRead(true);
				const res = await markFeedContentAsRead(feedId, feedContentId);

				if (res.errors) {
					feedsReadCount.setOptimisticUnread(
						feedId,
						feedUnreadCounts + 1,
						feedUnreadCounts,
					);
					setIsRead(false);
					toast.error([res.errors.feedId, res.errors.feedContentId].join(", "));
					return;
				}

				if (res.errI18Key) {
					feedsReadCount.setOptimisticUnread(
						feedId,
						feedUnreadCounts + 1,
						feedUnreadCounts,
					);
					setIsRead(false);
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
					return;
				}
			} catch (err) {
				feedsReadCount.setOptimisticUnread(
					feedId,
					feedUnreadCounts + 1,
					feedUnreadCounts,
				);
				setIsRead(false);
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error(t("errors.unexpected"));
				}
			}
		});
	};

	const handleMarkAsUnread = async (
		feedId: number,
		feedContentId: number,
	): Promise<void> => {
		feedsReadCount.setOptimisticUnread(
			feedId,
			feedUnreadCounts + 1,
			feedUnreadCounts,
		);
		startTransition(async () => {
			try {
				setIsRead(false);
				const res = await markFeedContentAsUnread(feedId, feedContentId);
				// Prevent double subtraction.

				if (res.errors) {
					feedsReadCount.setOptimisticUnread(
						feedId,
						feedUnreadCounts - 1,
						feedUnreadCounts,
					);
					setIsRead(true);
					toast.error([res.errors.feedId, res.errors.feedContentId].join(", "));
					return;
				}

				if (res.errI18Key) {
					feedsReadCount.setOptimisticUnread(
						feedId,
						feedUnreadCounts - 1,
						feedUnreadCounts,
					);
					setIsRead(true);
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
					return;
				}
			} catch (err) {
				feedsReadCount.setOptimisticUnread(
					feedId,
					feedUnreadCounts - 1,
					feedUnreadCounts,
				);
				setIsRead(true);
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error(t("errors.unexpected"));
				}
			}
		});
	};

	const handleToggleReadStatus = (
		checkState: CheckedState,
		feedId: number,
		feedContentId: number,
	): void => {
		if (checkState) {
			handleMarkAsRead(feedId, feedContentId);
		} else {
			handleMarkAsUnread(feedId, feedContentId);
		}
	};

	return (
		<div className="flex gap-2">
			<div className="pt-1 h-full">
				<Checkbox
					id={`readToggle-${item.id}`}
					className="rounded-full border border-dashed border-primary cursor-pointer"
					checked={isRead}
					onCheckedChange={(e): void => {
						handleToggleReadStatus(e, item.feedId, item.id);
					}}
				/>
				<label htmlFor={`readToggle-${item.id}`} className="sr-only">
					{isRead ? t("markAsUnread") : t("markAsRead")}
				</label>
			</div>

			<Link
				className={cn(SPACING.SM, "grow", {
					"opacity-50": isRead,
				})}
				onClick={(): Promise<void> => handleMarkAsRead(item.feedId, item.id)}
				href={userfeedsfuncs.formatFeedURL(item.url)}
				target="_blank"
			>
				<h2 className="tracking-tight text-xl font-semibold line-clamp-3">
					{item.title}
				</h2>
				<div>
					<p className="text-primary font-medium">
						{parsing.readableUrl(item.url)}
					</p>
					<p className="text-muted-foreground">
						{new Date(item.date).toLocaleDateString(locale)}
					</p>
				</div>
			</Link>

			<FeedContextMenu url={item.url} />
		</div>
	);
};
