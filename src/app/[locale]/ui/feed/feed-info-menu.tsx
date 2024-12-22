"use client";
import { useSelectedFeedStore } from "@/app/[locale]/lib/stores/selected-feed-store";
import { FeedInfoContextMenu } from "@/app/[locale]/ui/feed/feed-info-context-menu";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Feed } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbPlugConnectedX, TbRadarFilled, TbRss } from "react-icons/tb";

type Props = {
	feeds: Feed[];
};

export function FeedInfoMenu({ feeds }: Props): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [isOpen, setIsOpen] = useState(false);

	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);
	const totalContent = feeds.reduce(
		(sum, feed) => sum + (feed.content?.length ?? 0),
		0,
	);

	return (
		<>
			<Sheet open={isOpen} onOpenChange={(status): void => setIsOpen(status)}>
				<FeedInfoDetails
					totalFeeds={feeds.length}
					totalUnreachableFeeds={unreachableFeeds.length}
				/>
				<SheetContent side={"left"}>
					<SheetHeader>
						<SheetTitle
							className={`${lusitana.className} mb-6 text-left text-4xl leading-tight`}
						>
							{t("title")}
						</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col gap-4">
						<FeedMenuItemAll totalContent={totalContent} />
						<div>
							<p className="text-muted-foreground text-sm font-bold">
								{t("textFeedsCount", { count: feeds.length })}
							</p>
							<ScrollArea className="max-h-svh overflow-auto">
								{feeds.map((feed) => (
									<FeedMenuItem feed={feed} key={feed.id} />
								))}
							</ScrollArea>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<FeedInfoContextMenu feeds={feeds} />
		</>
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
					<button type="button" className="underline">
						{t("textFeedsCount", { count: totalFeeds })}
					</button>
					<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
					<button type="button" className="underline">
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
	const { setSelectedFeed, selectedFeed } = useSelectedFeedStore();

	return (
		<button
			type="button"
			onClick={(): void => {
				setSelectedFeed("all");
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`w-full px-2 cursor-pointer
							 flex justify-between items-center flex-wrap`,
				{
					"!bg-primary": selectedFeed === "all",
				},
			)}
		>
			<div className="flex gap-2">
				<TbRadarFilled
					size={20}
					className={cn("text-primary", {
						"text-secondary": selectedFeed === "all",
					})}
				/>
				<p>{t("allFeeds")}</p>
			</div>
			<p
				className={cn("text-primary", {
					"text-secondary": selectedFeed === "all",
				})}
			>
				{totalContent}
			</p>
		</button>
	);
}

function FeedMenuItem({
	feed,
}: {
	feed: Feed;
}): React.JSX.Element {
	const { setSelectedFeed, selectedFeed } = useSelectedFeedStore();

	return (
		<button
			type="button"
			onClick={(): void => {
				setSelectedFeed(feed.id.toString());
			}}
			className={cn(
				navigationMenuTriggerStyle(),
				`grid gridcols-[80%_1fr_1fr] grid-cols-[80%_1fr] gap-4
				cursor-pointer w-full px-2`,
				{
					"text-muted-foreground": feed.errorType !== null,
					"!bg-primary": selectedFeed === feed.id.toString(),
				},
			)}
		>
			<div className="flex gap-2 items-center overflow-hidden">
				{feed.errorType !== null ? (
					<TbPlugConnectedX
						size={20}
						className={cn("text-destructive shrink-0", {
							"text-secondary": selectedFeed === feed.id.toString(),
						})}
					/>
				) : (
					<TbRss
						size={20}
						className={cn("text-primary shrink-0", {
							"text-secondary": selectedFeed === feed.id.toString(),
						})}
					/>
				)}
				<div>
					<p className="truncate">{feed.title}</p>
				</div>
			</div>
			<div className="flex gap-4 items-center justify-end ">
				<p
					className={cn("text-primary text-end", {
						"text-secondary": selectedFeed === feed.id.toString(),
					})}
				>
					{feed.content?.length}
				</p>
			</div>
		</button>
	);
}
