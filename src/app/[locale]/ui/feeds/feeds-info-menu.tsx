"use client";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { TbPlugConnectedX, TbRadarFilled, TbRss } from "react-icons/tb";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/types";
import { FeedInfoContextMenu } from "@/app/[locale]/ui/feeds/feed-info-context-menu";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { FeedTimeline } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
	timeline: FeedTimeline[];
	userFeedsWithContentsCount: FeedWithContentsCount[];
};

export function FeedsInfoMenu({
	timeline,
	userFeedsWithContentsCount,
}: Props): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [isOpen, setIsOpen] = useState(false);

	const feeds = userFeedsWithContentsCount;
	const unreachableFeeds = feeds.filter(
		(feed) => feed.status !== FeedStatusType.ACTIVE,
	);

	return (
		<div className={SPACING.XS}>
			<Sheet open={isOpen} onOpenChange={(status): void => setIsOpen(status)}>
				<FeedInfoDetails
					totalFeeds={feeds.length}
					totalUnreachableFeeds={unreachableFeeds.length}
				/>

				<SheetContent side={"left"}>
					<SheetHeader>
						<SheetTitle className="text-left text-4xl leading-tight">
							{t("title")}
						</SheetTitle>
					</SheetHeader>

					<div className="flex flex-col gap-4">
						<FeedMenuItemAll totalContent={timeline.length} />
						<div>
							<p className="text-muted-foreground text-sm font-bold">
								{t("textFeedsCount", { count: feeds.length })}
							</p>

							<ScrollArea className="max-h-svh overflow-auto mt-2">
								{feeds.map((feed) => (
									<FeedMenuItem
										feed={feed}
										key={feed.id}
										onClick={(): void => setIsOpen(false)}
									/>
								))}
							</ScrollArea>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<FeedInfoContextMenu feeds={feeds} />
		</div>
	);
}

function FeedInfoDetails({
	totalFeeds,
	totalUnreachableFeeds,
}: {
	totalFeeds: number;
	totalUnreachableFeeds: number;
}): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	return (
		<SheetTrigger asChild>
			<div>
				<p className={"text-muted-foreground"}>
					<span>{t("textPartOne")}&nbsp;</span>
					<button type="button" className="underline cursor-pointer">
						{t("textFeedsCount", { count: totalFeeds })}
					</button>
					<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
					<button type="button" className="underline cursor-pointer">
						{t("textUnreachableCount", { count: totalUnreachableFeeds })}
					</button>
				</p>
			</div>
		</SheetTrigger>
	);
}

function FeedMenuItemAll({
	totalContent,
}: {
	totalContent: number;
}): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{ urlKeys: searchParamsState.urlKeys },
	);

	return (
		<button
			type="button"
			onClick={(): void => {
				setSearchParamsState({ selectedFeed: searchParamsState.DEFAULT_FEED });
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`grid grid-cols-[5%_1fr_15%] gap-4
				cursor-pointer w-full px6! py2! focus:bg-background`,
				{
					"bg-accent!": selectedFeed === searchParamsState.DEFAULT_FEED,
				},
			)}
		>
			<TbRadarFilled size={20} className={"text-primary"} />

			<p className="truncate text-left">{t("allFeeds")}</p>

			<p className={"text-primary text-end truncate"}>{totalContent}</p>
		</button>
	);
}

function FeedMenuItem({
	feed,
	onClick,
}: {
	feed: FeedWithContentsCount;
	onClick?: () => void;
}): React.JSX.Element {
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{ urlKeys: searchParamsState.urlKeys },
	);

	return (
		<button
			type="button"
			onClick={(): void => {
				setSearchParamsState({ selectedFeed: feed.id.toString() });
				onClick?.();
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`grid grid-cols-[5%_1fr_15%] gap-4
				cursor-pointer w-full px6! py2! focus:bg-background`,
				{
					"text-muted-foreground": feed.status !== FeedStatusType.ACTIVE,
					"bg-accent!": selectedFeed === feed.id.toString(),
				},
			)}
		>
			{feed.status !== FeedStatusType.ACTIVE ? (
				<TbPlugConnectedX size={20} className={"text-destructive"} />
			) : (
				<TbRss size={20} className={"text-primary"} />
			)}

			<p className="truncate text-left">{feed.title}</p>

			<p className={"text-primary text-end truncate"}>{feed.contentsCount}</p>
		</button>
	);
}
