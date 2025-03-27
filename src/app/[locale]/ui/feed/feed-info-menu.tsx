"use client";
import {
	SELECTED_FEED_DEFAULT,
	searchParamsParsers,
} from "@/app/[locale]/lib/stores/search-params";
import { FeedInfoContextMenu } from "@/app/[locale]/ui/feed/feed-info-context-menu";
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
import type { UserFeedsWithContent } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { TbPlugConnectedX, TbRadarFilled, TbRss } from "react-icons/tb";

type Props = {
	feeds: UserFeedsWithContent[];
};

export function FeedInfoMenu({ feeds }: Props): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [isOpen, setIsOpen] = useState(false);

	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);
	const totalContent = feeds.reduce(
		(sum, feed) => sum + (feed.contents?.length ?? 0),
		0,
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
						<FeedMenuItemAll totalContent={totalContent} />
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
	const [{ selectedFeed }, setSelectedFeed] =
		useQueryStates(searchParamsParsers);

	return (
		<button
			type="button"
			onClick={(): void => {
				setSelectedFeed({ selectedFeed: SELECTED_FEED_DEFAULT });
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`grid grid-cols-[5%_1fr_15%] gap-4
				cursor-pointer w-full px6! py2! focus:bg-background`,
				{
					"bg-accent!": selectedFeed === SELECTED_FEED_DEFAULT,
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
	feed: UserFeedsWithContent;
	onClick?: () => void;
}): React.JSX.Element {
	const [{ selectedFeed }, setSelectedFeed] =
		useQueryStates(searchParamsParsers);

	return (
		<button
			type="button"
			onClick={(): void => {
				setSelectedFeed({ selectedFeed: feed.toString() });
				onClick?.();
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`grid grid-cols-[5%_1fr_15%] gap-4
				cursor-pointer w-full px6! py2! focus:bg-background`,
				{
					"text-muted-foreground": feed.errorType !== null,
					"bg-accent!": selectedFeed === feed.id.toString(),
				},
			)}
		>
			{feed.errorType ? (
				<TbPlugConnectedX size={20} className={"text-destructive"} />
			) : (
				<TbRss size={20} className={"text-primary"} />
			)}

			<p className="truncate text-left">{feed.title}</p>

			<p className={"text-primary text-end truncate"}>{feed.title?.length}</p>
		</button>
	);
}
