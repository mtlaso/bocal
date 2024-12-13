"use client";

import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { useSelectedFeedStore } from "@/app/[locale]/lib/stores/selected-feed-store";
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
	const totalFeeds = feeds.length;
	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);
	const totalContent = feeds.reduce(
		(sum, feed) => sum + (feed.content?.length ?? 0),
		0,
	);

	const [_isOpen, _setIsOpen] = useState(false);
	const _isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<>
			<div className="md:hidden">
				<FeedInfoMenuMobile />
			</div>
			<div className="hidden md:block">
				<FeedInfoMenuDesktop
					totalFeeds={totalFeeds}
					totalUnreachableFeeds={unreachableFeeds.length}
					feeds={feeds}
					totalContent={totalContent}
				/>
			</div>
		</>
	);
}

function FeedInfoMenuDesktop({
	totalFeeds,
	totalUnreachableFeeds,
	feeds,
	totalContent,
}: {
	totalFeeds: number;
	totalUnreachableFeeds: number;
	feeds: Feed[];
	totalContent: number;
}): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [isOpen, setIsOpen] = useState(false);
	const { setSelectedFeed, selectedFeed } = useSelectedFeedStore();

	return (
		<Sheet open={isOpen} onOpenChange={(status): void => setIsOpen(status)}>
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
					<p className="text-muted-foreground">
						TODO! statut du feed selectionee ici!!! (pas pour 'tous')
					</p>
				</div>
			</SheetTrigger>
			<SheetContent side={"left"}>
				<SheetHeader>
					<SheetTitle
						className={`${lusitana.className} mb-6 text-left text-4xl leading-tight`}
					>
						{t("title")}
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-4">
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

					<div>
						<p className="text-muted-foreground text-sm font-bold">
							{t("textFeedsCount", { count: totalFeeds })}
						</p>
						<ScrollArea className="max-h-svh overflow-auto">
							{feeds.map((feed) => (
								<button
									type="button"
									onClick={(): void => {
										setSelectedFeed(feed.id.toString());
									}}
									key={feed.id}
									className={cn(
										navigationMenuTriggerStyle(),
										`grid grid-cols-[80%_20%]
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
										<p className="truncate">{feed.title}</p>
									</div>
									<p
										className={cn("text-primary text-end", {
											"text-secondary": selectedFeed === feed.id.toString(),
										})}
									>
										{feed.content?.length}
									</p>
								</button>
							))}
						</ScrollArea>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function FeedInfoMenuMobile(): React.JSX.Element {
	return <p>mobile</p>;
}
