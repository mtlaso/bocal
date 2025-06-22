"use client";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import {
	markFeedContentAsRead,
	markFeedContentAsUnread,
} from "@/app/[locale]/lib/actions";
import { getAppBaseURL } from "@/app/[locale]/lib/get-app-base-url";
import { parsing } from "@/app/[locale]/lib/parsing";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import { FeedContextMenu } from "@/app/[locale]/ui/feeds/feed-context-menu";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Checkbox } from "@/components/ui/checkbox";
import type { FeedContentWithReadAt, FeedWithContent } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Props = {
	feeds: FeedWithContent[];
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
		<section className={cn("wrap-anywhere", SPACING.LG)}>
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

	const [isRead, setIsRead] = useOptimistic(item.readAt !== null);

	const handleMarkAsRead = async (
		feedId: number,
		feedContentId: number,
	): Promise<void> => {
		startTransition(async () => {
			try {
				setIsRead(true);
				const res = await markFeedContentAsRead(feedId, feedContentId);

				if (res.errMessage) {
					toast.error(t(res.errMessage));
				}
			} catch (_err) {
				setIsRead(false);
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
				setIsRead(false);
				const res = await markFeedContentAsUnread(feedId, feedContentId);

				if (res.errMessage) {
					toast.error(t(res.errMessage));
				}
			} catch (_err) {
				setIsRead(true);
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

	function getURL(url: string) {
		const secondPart = url.split(userfeedsfuncs.NEWSLETTER_URL_PREFIX);

		switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
			case "development":
				if (secondPart.length > 1) {
					return `http://localhost:3000/userfeeds/${secondPart[1]}`;
				}
				return url;
			case "preview":
				if (secondPart.length > 1) {
					return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/${secondPart[1]}`;
				}
				return url;
			default:
				return url;
		}
	}

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
				href={getURL(item.url)}
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
					base url:
					{getAppBaseURL()}
				</div>
			</Link>

			<FeedContextMenu url={item.url} />
		</div>
	);
};
