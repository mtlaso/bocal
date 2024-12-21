"use client";
import {
	markFeedContentAsRead,
	markFeedContentAsUnread,
} from "@/app/[locale]/lib/actions";
import { removeWWW } from "@/app/[locale]/lib/remove-www";
import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import { useSelectedFeedStore } from "@/app/[locale]/lib/stores/selected-feed-store";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	flattenedContent: FlattenedFeedsContent[];
};

export function Feeds({ flattenedContent }: Props): React.JSX.Element {
	const t = useTranslations("rssFeed");
	const [isHydrated, setIsHydrated] = useState(false);
	const locale = useLocale();
	const { selectedFeed } = useSelectedFeedStore();

	const items = flattenedContent.filter((content) => {
		if (selectedFeed === "all") return true;
		return content.feedId.toString() === selectedFeed;
	});

	const handleMarkAsRead = async (
		feedId: number,
		feedContentId: string,
	): Promise<void> => {
		try {
			const res = await markFeedContentAsRead(feedId, feedContentId);

			if (res.message) {
				toast.error(t(res.message));
			}
		} catch (_err) {
			toast.error(t("errors.unexpected"));
		}
	};

	const handleMarkAsUnread = async (
		feedId: number,
		feedContentId: string,
	): Promise<void> => {
		try {
			const res = await markFeedContentAsUnread(feedId, feedContentId);

			if (res.message) {
				toast.error(t(res.message));
			}
		} catch (_err) {
			toast.error(t("errors.unexpected"));
		}
	};

	const handleToggleReadStatus = (
		checkState: CheckedState,
		feedId: number,
		feedContentId: string,
	): void => {
		if (checkState) {
			handleMarkAsRead(feedId, feedContentId);
		} else {
			handleMarkAsUnread(feedId, feedContentId);
		}
	};

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <LinksSkeleton />;
	}

	return (
		<section className={cn("grid", SPACING.MD)}>
			{items.map((item) => (
				<div key={`${item.id}-${item.feedId}`} className="flex items-start">
					<div className="mt-2 mr-2">
						<Checkbox
							id={`readToggle-${item.id}`}
							className="rounded-full border-dashed"
							checked={item.isRead !== null}
							onCheckedChange={(e): void => {
								handleToggleReadStatus(e, item.feedId, item.id);
							}}
						/>
						<label htmlFor={`readToggle-${item.id}`} className="sr-only">
							{item.isRead !== null ? t("markAsUnread") : t("markAsRead")}
						</label>
					</div>

					<Link
						className={cn(SPACING.SM, "flex-grow", {
							"bg-primary-oreground opacity-50": item.isRead,
						})}
						onClick={(): Promise<void> =>
							handleMarkAsRead(item.feedId, item.id)
						}
						href={item.url}
						target="_blank"
					>
						<h1 className="tracking-tight text-xl font-semibold">
							{item.title}
						</h1>
						<div>
							<p className="text-primary font-medium">
								{removeWWW(new URL(item.url).host)}
							</p>
							<p className="text-muted-foreground">
								{new Date(item.date).toLocaleDateString(locale)}
							</p>
						</div>
					</Link>
				</div>
			))}
		</section>
	);
}
