"use client";
import {
	markFeedContentAsRead,
	markFeedContentAsUnread,
} from "@/app/[locale]/lib/actions";
import { parsing } from "@/app/[locale]/lib/parsing";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import { FeedsContextMenu } from "@/app/[locale]/ui/feed/feeds-context-menu";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Checkbox } from "@/components/ui/checkbox";
import type { FeedContentWithReadAt, UserFeedWithContent } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";

type Props = {
	feeds: UserFeedWithContent[];
};

export function Feeds({ feeds }: Props): React.JSX.Element {
	const [{ selectedFeed }] = useQueryStates(searchParamsState.searchParams, {
		urlKeys: searchParamsState.urlKeys,
	});

	const items = feeds.filter((feed) => {
		if (selectedFeed === searchParamsState.DEFAULT_FEED) return true;
		return feed.id.toString() === selectedFeed;
	});

	return (
		<section className={cn("grid break-words", SPACING.LG)}>
			{items.map((item) => {
				return item.contents.map((content) => (
					<Item item={content} key={`${content.id}`} />
				));
			})}
		</section>
	);
}

const Item = ({ item }: { item: FeedContentWithReadAt }): React.JSX.Element => {
	const t = useTranslations("rssFeed");
	const locale = useLocale();

	const [isReadOptimistic, addIsReadOptimistic] = useOptimistic(
		item.readAt !== null,
	);

	const handleMarkAsRead = async (
		feedId: number,
		feedContentId: number,
	): Promise<void> => {
		startTransition(async () => {
			try {
				addIsReadOptimistic(true);
				const res = await markFeedContentAsRead(feedId, feedContentId);

				if (res.message) {
					toast.error(t(res.message));
				}
			} catch (_err) {
				addIsReadOptimistic(false);
				toast.error(t("errors.unexpected"));
			}
		});
	};

	const handleMarkAsUnread = async (
		feedId: number,
		feedContentId: number,
	): Promise<void> => {
		startTransition(async () => {
			try {
				addIsReadOptimistic(false);
				const res = await markFeedContentAsUnread(feedId, feedContentId);

				if (res.message) {
					toast.error(t(res.message));
				}
			} catch (_err) {
				addIsReadOptimistic(true);
				toast.error(t("errors.unexpected"));
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
		<div className="flex items-start justify-start">
			<div
				className="pt-1 pr-2
        flex flex-col justify-between h-full"
			>
				<Checkbox
					id={`readToggle-${item.id}`}
					className="rounded-full border border-dashed border-primary cursor-pointer"
					checked={isReadOptimistic}
					onCheckedChange={(e): void => {
						handleToggleReadStatus(e, item.feedId, item.id);
					}}
				/>
				<label htmlFor={`readToggle-${item.id}`} className="sr-only">
					{isReadOptimistic !== null ? t("markAsUnread") : t("markAsRead")}
				</label>
			</div>

			<Link
				className={cn(SPACING.SM, "grow", {
					"bg-primary-oreground opacity-50": isReadOptimistic,
				})}
				onClick={(): Promise<void> => handleMarkAsRead(item.feedId, item.id)}
				href={item.url}
				target="_blank"
			>
				<h1 className="tracking-tight text-xl font-semibold line-clamp-3">
					{item.title}
				</h1>
				<div>
					<p className="text-primary font-medium">
						{parsing.readableUrl(item.url)}
					</p>
					<p className="text-muted-foreground">
						{new Date(item.date).toLocaleDateString(locale)}
					</p>
				</div>
			</Link>

			<div className="pt-1 pl-2">
				<FeedsContextMenu url={item.url} />
			</div>
		</div>
	);
};
